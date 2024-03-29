import { v } from "convex/values";
//import { currentUser } from "@clerk/nextjs";
import {  mutation, query } from "./_generated/server";
import { DateTime } from 'luxon';

export const getChatLimited = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const fourteenDaysAgo = DateTime.now().minus({ days: 14 }).toJSDate();

    // Get the earliest chat for the user
    const firstChat = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("userId"), identity?.subject))
      .order("asc") // Order by ascending to get the earliest chat
      .first();

    // If there's no chat, or the first chat is within the last 14 days, allow chatting
    if (!firstChat || new Date(firstChat._creationTime) >= fourteenDaysAgo) {
      // Allow the user to chat
      return { allowed: true };
    }

    // If the first chat is older than 14 days, return null
    return null;
  },
});


export const updatedChat = mutation({
  args: {
    prompt: v.optional(v.string()),
    userId: v.optional(v.string()),
    conversationId: v.optional(v.string()),
    result: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
      .first();

    if (!chat) {
      throw new Error("Chat not found");
    }

    // const Chat = await ctx.db.patch({
    //   ...chat,
    //   prompt: args.prompt,
    //   userId: args.userId,
    //   result: args.result,
    // });
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    prompt: v.string(),
    result: v.string(),
    conversationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const Chat = await ctx.db.insert("chats", {
      userId: args.userId,
      prompt: args.prompt,
      result: args.result,
      isPinned: false,
      conversationId: args.conversationId,
    });
  },
})



// Context from Function convex/chats.ts:handler

export const pinned = mutation({
  args: {
    id: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingChat = await ctx.db.get(args.id);

    if (!existingChat) {
      throw new Error("Not found");
    }

    if (existingChat.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (existingChat.isPinned) {
      throw new Error("Already pinned");
    }

    const chat = await ctx.db.patch(args.id, {
      ...rest,
      isPinned: true,
    });

    return chat;
  },
});

export const unPinned = mutation({
  args: {
    id: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingChat = await ctx.db.get(args.id);

    if (!existingChat) {
      throw new Error("Not found");
    }

    if (existingChat.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const chat = await ctx.db.patch(args.id, {
      ...rest,
      isPinned: false,
    });

    return chat;
  },
});

export const getPinnedChats = query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Unauthenticated");
  }

  const userId = identity.subject;

  const pinnedChats = await ctx.db

    .query("chats")
    .filter((q) => q.eq(q.field("userId"), userId))
    .filter((q) => q.eq(q.field("isPinned"), true))
    .order("desc")
    .collect();

  return pinnedChats;

})


export const deleteChat = mutation({
  args: {
    id: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingChat = await ctx.db.get(args.id);

    if (!existingChat) {

      throw new Error("Not found");
    }

    if (existingChat.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const chat = await ctx.db.delete(args.id);

    return chat;
  },
})

export const getChats = query(async (ctx) => {

  const identity = await ctx.auth.getUserIdentity();
  const chats = await ctx.db.query("chats")
    .filter((q) => q.eq(q.field("userId"), identity?.subject))
    .order("desc")
    .collect();
  return chats;
});


