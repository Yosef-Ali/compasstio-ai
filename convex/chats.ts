import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    prompt: v.string(),
    result: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const chats = await ctx.db.insert("chats", {
      prompt: args.prompt,
      result: args.result,
      userId,
      isPinned: false,
    });

    return chats;
  },
});

// Context from Function convex/chats.ts:handler

export const handler = query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const chats = await ctx.db.query("chats").collect();
  if (!chats) {
    throw new Error("No chats found");
  }
});
