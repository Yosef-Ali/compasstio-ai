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
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    console.log("userId", identity);

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    // const existingGroup = await ctx.db
    //   .query("groups")
    //   .filter((q) => q.eq(q.field("userId"), userId))
    //   .first();

    // if (existingGroup) {
    //   throw new Error("Group already exists");
    // }

    const group = await ctx.db.insert("groups", {
      userId,
      description: user?.bio || "",
      avatarUrl: user?.avatarUrl || "",
      name: user?.name || "",
    });

    return group;
  },
});

export const deleteGroup = mutation({
  args: { _id: v.id("users") },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();

    // if (!identity) {
    //   throw new Error("Unauthenticated");
    // }

    const user = await ctx.db.get(args._id);

    console.log("user::", user);

    //console.log("userId", args.userId);

    const group = await ctx.db
      .query("groups")
      //.filter((q) => q.eq(q.field("userId"), identity.subject))

      //.withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("name"), user?.name))
      .first();

    console.log("group name", group?.name);

    if (!group) {
      throw new Error("Not found");
    }
    await ctx.db.delete(group._id);
  },
});
