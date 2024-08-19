import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  Horizon,
  Asset,
  TransactionBuilder,
  Operation,
  BASE_FEE,
  Networks,
  Keypair,
} from "@stellar/stellar-sdk";
import { env } from "~/env";
import { handleHorizonServerError } from "~/lib/utils";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export const stellarRouter = createTRPCRouter({
  getAccount: publicProcedure.input(z.string()).query(async ({ input }) => {
    // Fetch account from Horizon API
    const account = await server.loadAccount(input);
    return account;
  }),
  getAssets: publicProcedure.query(async () => {
    const assets = await server
      .assets()
      .forIssuer(env.ISSUER_PUBLIC_KEY)
      .call();
    return assets.records;
  }),
  mintAsset: publicProcedure
    .input(
      z.object({
        distributorPublicKey: z.string(),
        assetCode: z.string(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Create Asset (from issuer account)
      const asset = new Asset(input.assetCode, env.ISSUER_PUBLIC_KEY);

      // Fetch existing Asset on Database
      const existingAsset = await ctx.db.asset.findFirst({
        where: {
          asset_issuer_address: env.ISSUER_PUBLIC_KEY,
          asset_code: input.assetCode,
        },
      });
      if (!existingAsset) {
        // Insert the Asset on Database
        await ctx.db.asset.create({
          data: {
            asset_code: input.assetCode, // Will fail if not unique for this Issuer
            asset_issuer_address: env.ISSUER_PUBLIC_KEY,
          },
        });
      }

      // Build Transaction with Payment operation and trustline
      const account = await server.loadAccount(input.distributorPublicKey);
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.changeTrust({
            asset,
            source: input.distributorPublicKey,
            // limit could be defined here, we won't use it now
          }),
        )
        .addOperation(
          Operation.payment({
            source: env.ISSUER_PUBLIC_KEY,
            destination: input.distributorPublicKey,
            asset,
            amount: input.amount.toString(),
          }),
        )
        .setTimeout(30)
        .build();
      console.log(
        Keypair.fromSecret(env.ISSUER_SECRET_KEY).publicKey() ===
          env.ISSUER_PUBLIC_KEY,
      );
      // THis transaction requires the Issuer's signature
      transaction.sign(Keypair.fromSecret(env.ISSUER_SECRET_KEY));

      // Send XDR for client to sign
      return transaction.toXDR();
    }),
  submitTransaction: publicProcedure
    .input(z.string()) // Signed XDR
    .mutation(async ({ input }) => {
      const transaction = TransactionBuilder.fromXDR(input, Networks.TESTNET);
      return await server
        .submitTransaction(transaction)
        .catch(handleHorizonServerError);
    }),
});
