import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const journals = await ctx.db.query("journals").collect();
      if (!journals) {
        throw new Error("No journals found");
      }

      return journals;
    } catch (error) {
      // Log the error
      console.error(error);

      // Return a meaningful response to the user
      return {
        statusCode: 500,
        body: {
          message: "An error occurred while fetching the journals.",
        },
      };
    }
  },
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }

      if (typeof args.title !== "string") {
        throw new Error("Invalid title");
      }

      const userId = identity.subject;

      const journal = await ctx.db.insert("journals", {
        title: args.title,
        userId,
        isArchived: false,
        isPublished: false,
      });

      return journal;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
});
