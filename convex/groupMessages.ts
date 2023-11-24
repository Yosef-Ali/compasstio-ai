import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    id: v.string(),
  },

  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const userId = identity.subject;

      const recipientMessages = await ctx.db
        .query("messages")
        .withIndex("by_recipient", (q) => q.eq("recipient_id", args.id))
        .collect();

      const senderMessages = await ctx.db
        .query("messages")
        .withIndex("by_sender", (q) => q.eq("sender_id", args.id))
        .collect();

      const messages = recipientMessages.concat(senderMessages);

      if (!messages) {
        throw new Error("No messages found");
      }
      return messages;
    } catch (error) {
      // Log the error
      console.error(error);
    }
  },
});

export const sendMessage = mutation({
  args: {
    recipient_id: v.string(),
    message: v.string(),
  },

  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const userId = identity.subject;

      const messages = await ctx.db.insert("messages", {
        sender_id: userId,
        recipient_id: args.recipient_id,
        message_content: args.message,
        sent_at: new Date().toISOString(),
        seen_at: null,
      });

      return messages;
    } catch (error) {
      // Log the error
      console.error(error);
    }
  },
});

export const getLastMessage = query({
  args: {
    id: v.string(),
  },

  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const userId = identity.subject;

      const recipientMessage = await ctx.db
        .query("messages")
        .withIndex("by_recipient", (q) => q.eq("recipient_id", args.id))
        .order("desc")
        .take(1);

      const senderMessage = await ctx.db
        .query("messages")
        .withIndex("by_sender", (q) => q.eq("sender_id", args.id))
        .order("desc")
        .take(1);

      const message = recipientMessage.concat(senderMessage);

      if (!message) {
        throw new Error("No messages found");
      }
      return message.reverse();
    } catch (error) {
      // Log the error
      console.error(error);
    }
  },
});
