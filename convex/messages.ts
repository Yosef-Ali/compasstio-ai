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
    messageId: v.string(),
    chatId: v.string(),
    senderId: v.string(),
    content: v.string(),
    avatarUrl: v.string(),
    isRead: v.boolean(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }

      if (typeof args.messageId !== "string") {
        throw new Error("Invalid title");
      }

      const userId = identity.subject;

      const messages = await ctx.db.insert("messages", {
        // title: args.title,
        // userId,
        // isArchived: false,
        // isPublished: false,
        messageId: args.messageId,
        chatId: args.chatId,
        senderId: args.senderId,
        content: args.content,
        avatarUrl: args.avatarUrl,
        isRead: args.isRead,
      });

      return messages;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
});
