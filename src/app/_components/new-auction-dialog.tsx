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
  assetId: number;
}
export const NewAuctionDialog: React.FC<NewAuctionDialogProps> = ({
  assetId,
}) => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [startingPrice, setStartingPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const ctx = api.useContext();

  const startAuction = api.auction.create.useMutation({
    onError: () => toast.error("Failed to start auction"),
    onSuccess: () => {
      void ctx.auction.list.invalidate();
    },
  });
  const handleSubmit = async () => {
    if (!publicKey) {
      return toast.error("Wallet not connected");
    }
    setLoading(true);
    await startAuction.mutateAsync({
      startingPrice,
      publicKey,
      assetId,
    });
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-10 w-40 bg-black text-white hover:bg-white hover:text-black"
          variant="ghost"
        >
          Start Auction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start New Auction</DialogTitle>
          <DialogDescription>
            Enter the details for your auction item below.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="starting-price" className="text-right">
              Starting Price
            </Label>
            <Input
              id="starting-price"
              type="number"
              placeholder="$100"
              className="col-span-3"
              value={startingPrice}
              onChange={(e) => setStartingPrice(Number(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="1"
              className="col-span-3"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {loading ? "loading" : "Start Auction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewAuctionDialog;
