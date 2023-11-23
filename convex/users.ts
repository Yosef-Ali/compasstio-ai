import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
  },
});

// export const getAll = query({
//   handler: async (ctx) => {
//     return await ctx.db.query("users").collect();
//   },
// });

export const get = query(async ({ db }) => {
  return await db.query("users").order("desc").collect();
});

export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    username: v.string(),
    avatarUrl: v.string(),
    bio: v.string(),
    onboarded: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      userId: args.userId,
      name: args.name,
      username: args.username,
      avatarUrl: args.avatarUrl,
      bio: args.bio,
      onboarded: true,
    });
  },
});
