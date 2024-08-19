"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/FPF2rqfdKAG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useWallet } from "~/app/hooks/useWallet";

interface NewAuctionDialogProps {
  auctionId: number;
}
export const NewBidDialog: React.FC<NewAuctionDialogProps> = ({
  auctionId,
}) => {
  const { publicKey } = useWallet();
  const ctx = api.useContext();
  const [bid, setBid] = useState(0);
  const [loading, setLoading] = useState(false);

  const placeBid = api.auction.bid.useMutation({
    onError: () => toast.error("Failed to place bid"),
    onSuccess: () => {
      toast.success("Bid placed successfully");
      void ctx.auction.invalidate();
    },
  });

  const handlePlaceBid = async () => {
    if (!publicKey) {
      return;
    }
    setLoading(true);
    try {
      await placeBid.mutateAsync({
        auctionId,
        bidder: publicKey,
        amount: bid,
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-10 w-40 bg-black text-white" variant="outline">
          Bid
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bid</DialogTitle>
          <DialogDescription>Insert your bid</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bid" className="text-right">
              My Bid
            </Label>
            <Input
              id="bid"
              type="number"
              placeholder="$100"
              className="col-span-3"
              value={bid}
              onChange={(e) => setBid(Number(e.target.value))}
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            onClick={handlePlaceBid}
            className="h-10 w-40 bg-black text-white"
            variant="outline"
          >
            Place bid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewBidDialog;
