import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

// This is the handler for Stripe webhook events
export const stripeWebhook = httpAction(async (ctx, request) => {
  // Retrieve the Stripe signature from the request headers
  const signature: string = request.headers.get("stripe-signature") as string;

  // Run the internal action to fulfill the Stripe event
  const result = await ctx.runAction(internal.stripe.fulfill, {
    signature,
    payload: await request.text(),
  });

  // Return a response based on the result of the internal action
  if (result.success) {
    // If successful, return a 200 status code
    return new Response(null, {
      status: 200,
    });
  } else {
    // If there's an error, return a 400 status code with an error message
    return new Response("Webhook Error", {
      status: 400,
    });
  }
});
