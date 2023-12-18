import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const getUser = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {

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
  },
});

export const getFriend = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const friend = await ctx.db.get(args.id);

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

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    // use `args` and/or `ctx.auth` to authorize the user
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const uploadUrl = await ctx.storage.generateUploadUrl();
    console.log("uploadUrl:", uploadUrl);

    if (!uploadUrl) {
      throw new Error("Upload URL generation failed");
    }

    // update the user with the upload URL


    return uploadUrl;
  },
});


export const updateAvatar = mutation({
  args: {
    id: v.id("users"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const { id } = args;

    const existingUser = await ctx.db.get(id);

    if (!existingUser) {
      throw new Error("Not found");
    }

    if (existingUser._id !== userId) {
      throw new Error("Unauthorized");
    }

    const url = await ctx.storage.getUrl(args.storageId);

    console.log("URL:", url);

    if (!url) {
      throw new Error("Upload URL generation failed");
    }


    const user = await ctx.db.patch(id, {
      avatarUrl: url,
    });


    console.log("user from server:", user);

    return user;
  },
});


