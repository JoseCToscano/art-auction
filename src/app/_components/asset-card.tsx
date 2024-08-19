import { Asset } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { shortenStellarAddress } from "~/lib/utils";
import NewAuctionDialog from "~/app/_components/new-auction-dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default function ArtPieceCard(asset: Asset) {
  return (
    <Link
      key={asset.asset_code}
      href="#"
      className="bg-background group overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl"
      prefetch={false}
    >
      <Image
        src="/images/default.png"
        alt={asset.asset_code}
        width={400}
        height={400}
        className="aspect-square w-full object-cover transition-opacity group-hover:opacity-80"
      />
      <div className="p-4">
        <h3 className="flex h-8 items-center justify-between text-lg font-semibold">
          {asset.asset_code}
          <Badge className="ml-2">
            {shortenStellarAddress(
              shortenStellarAddress(asset.asset_issuer_address),
            )}
          </Badge>
        </h3>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-2xl font-bold">
            {asset.stellar_asset_contract}
          </div>
          <NewAuctionDialog assetId={asset.id} />
        </div>
      </div>
    </Link>
  );
}
