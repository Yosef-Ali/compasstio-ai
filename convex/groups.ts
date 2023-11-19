import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const groups = await ctx.db.query("groups").collect();

      return groups;
    } catch (err) {
      // Log the error
      console.error(err);

      // Return a meaningful response to the user
      return {
        statusCode: 500,
        body: {
          message: "An error occurred while fetching the groups.",
        },
      };
    }
  },
});

export const getById = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const group = await ctx.db.get(args.groupId);

    if (!group) {
      throw new Error("Not found");
    }

    return group;
  },
});

export const create = mutation({
  args: {
    description: v.string(),
    avatarUrl: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const userId = identity.subject;

      const group = await ctx.db.insert("groups", {
        description: args.description,
        avatarUrl: args.avatarUrl,
        name: args.name,
      });

      return group;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
});
