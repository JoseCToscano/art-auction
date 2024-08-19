"use client";
import type { Auction, Asset } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { shortenStellarAddress } from "~/lib/utils";
import PlaceBidDialog from "~/app/_components/place-bid-dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { useWallet } from "~/app/hooks/useWallet";
import { Badge } from "~/components/ui/badge";

interface AuctionCardProps {
  auction: Auction & { asset: Asset };
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const ctx = api.useContext();

  const close = api.auction.closeAuction.useMutation({
    onError: () => toast.error("Failed to close auction"),
    onSuccess: () => {
      toast.success("Auction closed successfully");
      void ctx.auction.invalidate();
    },
  });

  const handleClose = async () => {
    if (!publicKey) {
      return toast.error("You need to be logged in to close an auction");
    }
    setLoading(true);
    try {
      await close.mutateAsync({
        auctionId: auction.id,
        owner: publicKey,
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to close auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      key={auction.id}
      href="#"
      className="bg-background group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl"
      prefetch={false}
    >
      <Image
        src="/images/default.png"
        alt={`${auction.asset.asset_code} - ${auction.asset.stellar_asset_contract}`}
        width={400}
        height={400}
        className="aspect-square w-full object-cover transition-opacity group-hover:opacity-80"
      />
      <div className="p-4">
        <h3 className="flex w-full items-center justify-between text-lg font-semibold">
          {auction.asset.asset_code}
          <Badge className="text-muted-foreground bg-black text-sm text-white">
            {shortenStellarAddress(auction.asset.asset_issuer_address ?? "")}
          </Badge>
        </h3>
        <p className="text-muted-foreground text-sm">
          Owner: {shortenStellarAddress(auction.owner_address)}
        </p>
        <p>Current Bid: {auction.current_bid}</p>
        {auction.current_bidder && (
          <p>Current Bidder: {shortenStellarAddress(auction.current_bidder)}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-2xl font-bold">
            {auction.asset.stellar_asset_contract}
          </div>
          <PlaceBidDialog auctionId={auction.id} />
          {auction.owner_address === publicKey && (
            <Button
              onClick={handleClose}
              className="h-10 w-40 bg-black text-white"
              variant="outline"
            >
              {loading ? "Closing..." : "Close"}
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;
