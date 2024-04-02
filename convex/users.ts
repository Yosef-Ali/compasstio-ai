
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { UserJSON } from "@clerk/backend";
import { GenericQueryCtx } from "convex/server";

export const getEndsOn = query({
  args: {},
  handler: async (ctx) => {
    // Authenticate user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated user");

    // Retrieve user by token identifier
    const user = await ctx.db.query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found!");

    // Determine if the user is non-subscribed
    const isNonSubscribedUser = !user.endsOn || new Date(user.endsOn * 1000) < new Date();

    // If the user is non-subscribed, check chat limit
    if (isNonSubscribedUser) {
      const todayStart = new Date().setHours(0, 0, 0, 0);
      const chatCount = await ctx.db.query("chats")
        .filter(q => q.eq("userId", user.userId) && q.gte("_creationTime", new Date(todayStart).toISOString()))
        .collect;

      if (chatCount.length >= 5) throw new Error("Maximum chat limit reached for today");
    }

    // Return the subscription end date
    return {
      success: true,
      endsOn: user.endsOn,
      message: 'Subscription end date retrieved successfully.'
    };
  },
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authenticated user");
    }

    // Check if the user is already stored
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (user) {
      // User exists, update their information
      return await ctx.db.patch(user._id, {
        name: identity.name || "",
        username: identity.preferredUsername || "",
        avatarUrl: identity.pictureUrl || "",
        email: identity.emailVerified ? identity.email : "",
      });
    } else {
      // User doesn't exist, create a new one
      return await ctx.db.insert("users", {
        userId: identity.subject,
        name: identity.name || "",
        username: identity.name || "",
        avatarUrl: identity.pictureUrl || "",
        email: identity.emailVerified ? identity.email : "",
        bio: "",
        endsOn: 0,
        tokenIdentifier: identity.tokenIdentifier,
      });
    }
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    username: v.string(),
    avatarUrl: v.string(),
    email: v.string(),
    bio: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Get the user document from the database
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();

      if (user) {
        // Update the user document in the database
        await ctx.db.patch(user._id, {
          name: args.name,
          username: args.username,
          avatarUrl: args.avatarUrl,
          email: args.email,
          bio: args.bio,
        });
      } else {
        console.error('User not found:', args.userId);
        // Handle the case where the user is not found
        // For example, throw an error or return a specific message
      }
    } catch (error) {
      // Handle any potential errors
      console.error('Error updating user:', error);
      throw error;
    }
  },
});



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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authenticated user");
    }

    // check if user is already stored
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    return await ctx.db.insert("users", {
      userId: args.userId,
      name: args.name,
      username: args.username,
      avatarUrl: args.avatarUrl,
      email: args.email,
      bio: args.bio,
      endsOn: 0,
      tokenIdentifier: identity.tokenIdentifier,
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

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated user");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
  }
})


//update subscription
export const updateSubscription = internalMutation({
  args: { subscriptionId: v.string(), userId: v.id("users"), endsOn: v.number() },
  handler: async (ctx, { subscriptionId, userId, endsOn }) => {
    await ctx.db.patch(userId, {
      subscriptionId: subscriptionId,
      endsOn: endsOn
    });
  },
});

//update subscription by id
export const updateSubscriptionById = internalMutation({
  args: { subscriptionId: v.string(), endsOn: v.number() },
  handler: async (ctx, { subscriptionId, endsOn }) => {
    const user = await ctx.db.query("users")
      .withIndex("by_subscriptionId", (q) => q.eq("subscriptionId", subscriptionId))
      .unique();

    if (!user) {
      throw new Error("User not found!");
    }

    await ctx.db.patch(user._id, {
      endsOn: endsOn
    });
  },
});

/** Get user by Clerk use id (AKA "subject" on auth)  */
export const _getUser = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return await userQuery(ctx, args.subject);
  },
});

export const updateOrCreateUser = internalMutation({
  args: { clerkData: v.any() },
  async handler(ctx, { clerkData }) {
    const userRecord = await userQuery(ctx, clerkData.id);

    if (userRecord === null) {
      // Create a new user with Clerk data
      await ctx.db.insert("users", {
        clerkData,
        avatarUrl: clerkData.avatarUrl || "",
        username: clerkData.username || "",
        email: clerkData.email || "",
      });
    } else {
      console.log("userRecord", userRecord)
      // Update existing user with new Clerk data
      await ctx.db.patch(userRecord._id, {
        clerkData,
        avatarUrl: clerkData.avatarUrl || "",
        username: clerkData.username || "",
        email: clerkData.email || "",
      });
    }
  },
});

// Adjusted userQuery function to work with the new clerkData field
async function userQuery(ctx: QueryCtx, clerkUserId: string): Promise<Doc<"users"> | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkData.id", clerkUserId))
    .unique();
}

export const deleteUser = internalMutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const userRecord = await userQuery(ctx, id);

    if (userRecord === null) {
      console.warn("can't delete user, does not exist", id);
    } else {
      await ctx.db.delete(userRecord._id);
    }
  },
});