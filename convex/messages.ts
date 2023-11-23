import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const messages = await ctx.db.query("messages").collect();
      if (!messages) {
        throw new Error("No messages found");
      }

      return messages;
    } catch (error) {
      // Log the error
      console.error(error);

      // Return a meaningful response to the user
      return {
        statusCode: 500,
        body: {
          message: "An error occurred while fetching the journals.",
        },
      };
    }
  },
});

export const create = mutation({
  args: {
    message_content: v.string(),
    recipient_id: v.string(),
    seen_at: v.union(v.null(), v.string()),
    sender_id: v.string(),
    sent_at: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { subject: userId } = identity;

    const messages = await ctx.db.insert("messages", {
      message_content: args.message_content,
      recipient_id: args.recipient_id,
      seen_at: args.seen_at,
      sender_id: args.sender_id,
      sent_at: args.sent_at,
    });

    return messages;
  },
});
