"use client";
import { api } from "~/trpc/react";
import AuctionCard from "~/app/_components/auction-card";

export default function Page() {
  const auctions = api.auction.list.useQuery();
  return (
    <div>
      <h1 className="p-10 text-3xl font-semibold">Auctions</h1>

      <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {auctions.data?.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </main>
    </div>
  );
}
