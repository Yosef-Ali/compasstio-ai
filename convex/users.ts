import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), args.id))
        .first();

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
});

export const getFriend = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const friend = await ctx.db.query("users")
      .filter(q => q.eq(q.field("userId"), args.id))
      .first();

    if (!friend) {
      return null;
    }

    return friend;

  }
})


export const get = query(async ({ db }) => {
  return await db.query("users").order("desc").collect();
});


export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    username: v.string(),
    avatarUrl: v.string(),
    email: v.string(),
    bio: v.string(),
    onboarded: v.boolean(),

  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      userId: args.userId,
      name: args.name,
      username: args.username,
      avatarUrl: args.avatarUrl,
      email: args.email,
      bio: args.bio,
      onboarded: true,
    });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    // use `args` and/or `ctx.auth` to authorize the user
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const uploadUrl = await ctx.storage.generateUploadUrl();

    if (!uploadUrl) {
      throw new Error("Upload URL generation failed");
    }

    return uploadUrl;
  },
});


export const updateAvatar = mutation({
  args: {
    id: v.id("users"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {

    const url = await ctx.storage.getUrl(args.storageId);

    if (!url) {
      throw new Error("Upload URL generation failed");
    }
    const user = await ctx.db.patch(args.id, {
      avatarUrl: url as string,
    });

    return user;
  },
});

export const getAllUsersNameAndEmail = query({
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .collect();
    return users.map((user) => ({
      name: user.username,
      email: user.email,
    }));
  }
})

export const getAllUsersByEmail = query({
  args: {
    email: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first()
    return user
  }

})


