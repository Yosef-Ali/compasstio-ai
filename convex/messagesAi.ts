import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllMessages = query({
  handler: async (ctx) => {
    try {
      const messagesAi = await ctx.db.query("messagesAi").collect();
      return messagesAi;
    } catch (error) {
      // Log the error
      console.error(error);

      // Return a meaningful response to the user
      return {
        statusCode: 500,
        body: {
          message: "An error occurred while fetching the messages.",
        },
      };
    }
  },
});

export const create = mutation({
  args: {
    id: v.string(),
    createdAt: v.number(),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    return ctx.db.insert("messagesAi", {
      id: args.id,
      userId,
      createdAt: args.createdAt,
      content: args.content,
      role: args.role,
    });
  },
});
