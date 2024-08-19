"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/OmChSWhe1ue
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useWallet } from "~/app/hooks/useWallet";

export default function NewAssetDialog() {
  const { publicKey, signXDR } = useWallet();
  const [amount, setAmount] = useState(0);
  const [assetCode, setAssetCode] = useState("");
  const [loading, setLoading] = useState(false);

  const ctx = api.useContext();

  // Procedure to create XDR for minting asset
  const mint = api.stellar.mintAsset.useMutation({
    onError: () => toast.error("Failed to mint asset"),
  });

  // Submit transaction to Horizon API
  const submitTransaction = api.stellar.submitTransaction.useMutation({
    onError: () => toast.error("Failed to submit transaction"),
    onSuccess: () => {
      toast.success("Asset minted successfully");
      // Re-fetch assets
      void ctx.asset.list.invalidate();
    },
  });

  const handleSubmit = async () => {
    try {
      if (!publicKey) {
        return toast.error("Wallet not connected");
      }
      setLoading(true);
      // Call the API to mint the asset
      const xdr = await mint.mutateAsync({
        distributorPublicKey: publicKey,
        amount,
        assetCode,
      });

      // We need to submit the signed XDR to the Horizon API
      const signedXDR = await signXDR(xdr);
      if (typeof signedXDR === "string") {
        console.log("signedXDR: string", signedXDR);
        // Submit signed XDR to Horizon API
        await submitTransaction.mutateAsync(signedXDR);
      } else {
        console.log("signedXDR: string", signedXDR);
        await submitTransaction.mutateAsync(signedXDR.signedTxXdr);
      }

      // Submit signed XDR to Horizon API
    } catch (err) {
      console.error(err);
      toast.error("Failed to mint asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="hoveer:bg-white h-8 border-[1px] border-black bg-black px-4 text-white hover:text-black"
          variant="ghost"
        >
          Create New Art Piece Token
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Art Piece Token</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                if (e.target.value) {
                  setAmount(Number(e.target.value));
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="asset-code">Asset Code</Label>
            <Input
              id="asset-code"
              placeholder="Enter asset code"
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="h-8 border-[1px] border-black bg-black px-4 text-white hover:bg-white hover:text-black"
            type="submit"
            onClick={handleSubmit}
          >
            {loading ? "Minting..." : "Mint Asset"}
          </Button>
          <div>
            <Button
              className="h-8 border-[1px] border-black bg-black px-4 text-white hover:bg-white hover:text-black"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
