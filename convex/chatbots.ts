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

      const chatbots = await ctx.db.query("chatbots").collect();
      if (!chatbots) {
        throw new Error("No messages found");
      }

      return chatbots;
    } catch (error) {
      // Log the error
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
    botId: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    intents: v.optional(v.string()),
    responses: v.optional(v.string()),
    context: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isPinned: v.boolean(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }

      if (typeof args.botId !== "string") {
        throw new Error("Invalid title");
      }

      const userId = identity.subject;

      const chatbots = await ctx.db.insert("chatbots", {
        botId: args.botId,
        name: args.name,
        description: args.description,
        intents: args.intents,
        responses: args.responses,
        context: args.context,
        avatarUrl: args.avatarUrl,
        isPinned: args.isPinned,
      });

      return chatbots;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
});
