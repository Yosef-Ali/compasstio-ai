import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.API_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

export const create = mutation({
  args: {
    userId: v.string(),
    prompt: v.string(),
    result: v.string(),
    creationTime: v.number(),
    isPinned: v.boolean(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }
      const userId = identity.subject;
      const chat = await ctx.db.insert("chats", {
        userId,
        prompt: args.prompt,
        result: args.result,
        isPinned: false,
      });
      return chat;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
});
