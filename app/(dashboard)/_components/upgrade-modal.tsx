"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UpgradeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}



export const UpgradeModal = ({
  open,
  setOpen
}: UpgradeModalProps) => {
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const upgrade = useAction(api.stripe.pay);
  const price = useAction(api.stripe.getSubscriptionPrice);
  const router = useRouter();

  const handleUpgrade = async () => {
    const url = await upgrade({});
    if (!url) return;
    router.push(url);
  }

  useEffect(() => {
    const fetchPrice = async () => {
      const subscriptionPrice = await price();
      if (subscriptionPrice && subscriptionPrice.unit_amount) {

        const formattedPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(subscriptionPrice.unit_amount / 100);
        setFormattedPrice(formattedPrice);
      } else {
        console.log("Failed to fetch subscription price");
      }
    };

    fetchPrice();
  }, [price]);


  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogContent className="border-none max-w-2xl">
        <DialogHeader className="p-3">
          <DialogTitle>Upgrade your subscription</DialogTitle>
        </DialogHeader>
        <Separator className="h-[1px]" />
        <div className="flex justify-between">
          {/* Free Plan */}
          <div className="w-1/2 p-4 gap-y-2">
            <h3 className="text-lg font-semibold">Free</h3>
            <p className="font-thin ">USD $0/month</p>
            <Button
              disabled
              className="font-semibold text-xs bg-neutral-500 p-4 my-4 text-wrap"
            >Your current subscription</Button>
            <h4 className="text-sm mb-4">For just starting</h4>
            <div className="flex flex-col gap-y-3 text-sm">
              <div className="flex gap-x-4 items-center">
                <Check className="h-4 w-4" />
                <p>Limited chat with AI.</p>
              </div>
              <div className="flex gap-x-4 items-center">
                <Check className="h-4 w-4" />
                <p>Unlimited messaging and history.</p>
              </div>
              <div className="flex gap-x-4 items-center">
                <Check className="h-4 w-4" />
                <p>Unlimited journal and history.</p>
              </div>
              <div className="flex gap-x-4 items-center">
                <Check className="h-4 w-4" />
                <p>Unlimited task and history.</p>
              </div>
              <div className="flex items-center space-x-4">
                <Check className="h-4 w-4" />
                <p className="flex-1">
                  Unlimited live streaming <span className="font-bold text-purple-500">(Join option)</span>.
                </p>
              </div>
            </div>
          </div>
          <Separator orientation="vertical" className="w-[1px]" />
          {/* Paid Plan */}
          <div className="w-1/2 p-4 gap-y-2">
            <h3 className="text-lg font-semibold">Pro</h3>
            <p className="font-thin ">USD {formattedPrice}/month</p>
            <Button
              className="font-semibold text-xs bg-purple-500 hover:bg-purple-700 p-4 my-4"
              onClick={handleUpgrade}
            >Upgrade to Pro</Button>
            <h4 className="text-sm mb-4">Unlock all features</h4>
            <div className="flex flex-col gap-y-3 text-sm">
              <div className="flex gap-x-4 items-center">
                <Check className="h-4 w-4" />
                <p>Unlimited chat with AI.</p>
              </div>
              <div className="flex gap-x-4 items-center">
                <Check className="h-4 w-4" />
                <p>Unlimited messaging and history.</p>
              </div>
              <div className="flex gap-x-4 items-center">
                <Check className="h-4 w-4" />
                <p>Unlimited journal and history.</p>
              </div>
              <div className="flex gap-x-4 items-center">
                <Check className="h-4 w-4" />
                <p>Unlimited task and history.</p>
              </div>
              <div className="flex items-center space-x-4">
                <Check className="h-4 w-4" />
                <p className="flex-1">Unlimited live streaming <span className="text-purple-500 font-semibold">(Create and Join)</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}