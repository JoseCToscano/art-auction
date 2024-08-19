"use client";
import { useWallet } from "~/app/hooks/useWallet";
import { shortenStellarAddress } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";

export default function Nav() {
  const { publicKey, account, network, connectWallet } = useWallet();
  return (
    <div className="sticky top-0 flex h-16 w-full items-center justify-between border-[1px] border-b bg-neutral-300 font-semibold">
      <div className="flex items-center justify-start gap-2">
        <Badge className="ml-16 rounded-full bg-black bg-gradient-to-br from-black to-gray-700 p-2 px-4 text-sm">
          Wallet:{" "}
          {shortenStellarAddress(publicKey ?? "") ?? "No wallet connected"}
        </Badge>
        Balance:{" "}
        {account?.balances?.find((b) => b.asset_type === "native")?.balance ??
          "0"}{" "}
        XLM
      </div>
      {publicKey ? (
        <Badge className="mr-16 rounded-full bg-black bg-gradient-to-br from-black to-gray-700 p-2 px-4 text-sm">
          Connected to {network}
        </Badge>
      ) : (
        <button
          className={
            "h-8 rounded-md border-black bg-black px-2 py-1 text-white"
          }
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
