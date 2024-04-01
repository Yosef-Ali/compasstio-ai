import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

// Helper function to ensure environment variables are set
function ensureEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Retrieve the Clerk webhook secret from environment variables
const webhookSecret = ensureEnvironmentVariable("CLERK_WEBHOOK_SECRET");

// Define the Clerk webhook handler
export const handleClerkWebhook = httpAction(async (ctx, request) => {
  // Validate the incoming webhook request
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Error occurred", { status: 400 });
  }

  // Process the event based on its type
  switch (event.type) {
    case "user.created":
    case "user.updated":
      const userId = event.data.id;
      if (!userId) {
        console.warn("User ID is missing in the event data");
        return new Response("User ID is missing", { status: 400 });
      }

      const existingUser = await ctx.runQuery(internal.users._getUser, { subject: userId });
      if (existingUser && event.type === "user.created") {
        console.warn(`Overwriting existing user: ${userId}`);
      }

      console.log(`Processing user: ${userId}`);
      await ctx.runMutation(internal.users.updateOrCreateUser, { clerkData: event.data });
      break;

    case "user.deleted":
      const idToDelete = event.data.id;
      if (!idToDelete) {
        console.warn("User ID is missing for deletion event");
        return new Response("User ID is missing for deletion", { status: 400 });
      }

      await ctx.runMutation(internal.users.deleteUser, { id: idToDelete });
      break;

    default:
      console.log(`Ignored Clerk webhook event: ${event.type}`);
  }

  return new Response(null, { status: 200 });
});

// Validate the webhook request and parse the event
async function validateRequest(req: Request): Promise<WebhookEvent | undefined> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(webhookSecret);
  try {
    const event = webhook.verify(payloadString, svixHeaders);
    return event as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return undefined;
  }
}
