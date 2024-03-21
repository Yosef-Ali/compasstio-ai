import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";
import Stripe from 'stripe';
import { Id } from "./_generated/dataModel";

export const pay = action({
  args: {},
  handler: async (ctx) => {
    const clerkUser = await ctx.auth.getUserIdentity();
    const user = await ctx.runQuery(api.users.currentUser, {});

    if (!user || !clerkUser) {
      throw new Error("User not authenticated!");
    }

    if (!clerkUser.emailVerified) {
      throw new Error("User email not verified!");
    }

    const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16"
    });

    const domain = process.env.NEXT_PUBLIC_HOSTING_URL!;

    const session: Stripe.Response<Stripe.Checkout.Session> = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        line_items: [
          {
            price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID!,
            quantity: 1,
          },
        ],
        customer_email: clerkUser.email,
        metadata: {
          userId: user._id,
        },
        success_url: `${domain}`,
        cancel_url: `${domain}`,
      }
    );
    return session.url;
  },
});

type Metadata = {
  userId: Id<"users">;
}