
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalAction, query } from "./_generated/server";
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
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Pro Subscription',
                description: 'Monthly Pro access'
              },
              unit_amount: 100, // $1.00
              recurring: {
                interval: 'month'
              }
            },
            quantity: 1,
          },
        ],
        customer_email: clerkUser.email,
        metadata: {
          userId: user._id,
        },
        // redirect to your success url
        success_url: `${domain}`,
        cancel_url: `${domain}`,
      }
    );
    console.log("session", session.payment_intent);
    return session.url;
  },
});

type Metadata = {
  userId: Id<"users">;
}

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async ({ runQuery, runMutation }, { signature, payload }) => {
    const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    try {
      const event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        webhookSecret
      );
      const completedEvent = event.data.object as Stripe.Checkout.Session & {
        metadata: Metadata;
      }

      if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string
        )

        const userId = completedEvent.metadata.userId;

        await runMutation(internal.users.updateSubscription, {
          userId,
          subscriptionId: subscription.id,
          endsOn: subscription.current_period_end * 1000,
        });
      }

      if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
          completedEvent.subscription as string
        );

        await runMutation(internal.users.updateSubscriptionById, {
          subscriptionId: subscription.id,
          endsOn: subscription.current_period_end * 1000,
        });
      }

      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, error: (error as { message: string }).message };
    }
  },
});

export const getSubscriptionPrice = action({
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

    const price = await stripe.prices.retrieve(process.env.STRIPE_SUBSCRIPTION_PRICE_ID!)

    if (!price) {
      throw new Error("Price not found!");
    }
    return price
  }
})
