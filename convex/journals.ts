import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const journals = await ctx.db
        .query("journals")
        .filter((q) => q.eq(q.field("userId"), identity.subject))
        .order("desc")
        .take(100);
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

export const getArchived = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const journals = await ctx.db
        .query("journals")
        .filter((q) => q.eq(q.field("userId"), identity.subject))
        .filter((q) => q.eq(q.field("isArchived"), true))
        .order("desc")
        .take(100);
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


export const getTotal = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const journals = await ctx.db
        .query("journals")
        .filter((q) => q.eq(q.field("userId"), identity.subject))
        .collect();

      return journals.length;
    } catch (error) {
      // Log the error
      console.error(error);
    }

    return 0;
  },

})

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

export const getById = query({
  args: { journalId: v.id("journals") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const journal = await ctx.db.get(args.journalId);

    if (!journal) {
      throw new Error("Not found");
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (journal.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return journal;
  },
});

export const update = mutation({
  args: {
    id: v.id("journals"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingJournal = await ctx.db.get(args.id);

    if (!existingJournal) {
      throw new Error("Not found");
    }

    if (existingJournal.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const journal = await ctx.db.patch(args.id, {
      ...rest,
    });

    return journal;
  },
});

export const archiveJournal = mutation({
  args: {
    id: v.id("journals"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingJournal = await ctx.db.get(args.id);

    if (!existingJournal) {
      throw new Error("Not found");
    }

    if (existingJournal.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const journal = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    return journal;
  },
});


export const restoreJournal = mutation({
  args: {
    id: v.id("journals"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingJournal = await ctx.db.get(args.id);

    if (!existingJournal) {
      throw new Error("Not found");
    }

    if (existingJournal.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const journal = await ctx.db.patch(args.id, {
      isArchived: false,
    });

    return journal;
  },
});


export const removeIcon = mutation({
  args: { id: v.id("journals") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingJournal = await ctx.db.get(args.id);

    if (!existingJournal) {
      throw new Error("Not found");
    }

    if (existingJournal.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const journal = await ctx.db.patch(args.id, {
      icon: undefined,
    });

    return journal;
  },
});

export const remove = mutation({
  args: { id: v.id("journals") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingJournal = await ctx.db.get(args.id);

    if (!existingJournal) {
      throw new Error("Not found");
    }

    if (existingJournal.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
