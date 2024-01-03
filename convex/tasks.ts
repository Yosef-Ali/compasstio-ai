import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const tasks = await ctx.db
        .query("tasks")
        .filter((q) => q.eq(q.field("userId"), identity.subject))
        .order("desc")
        .take(100);
      if (!tasks) {
        throw new Error("No tasks found");
      }
      return tasks;
    } catch (error) {
      // Log the error
      console.error(error);
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

      const task = await ctx.db.insert("tasks", {
        title: args.title,
        userId,
        status: null,
        description: "",
        dueDate: 0,
      });

      return task;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
});

export const getById = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const task = await ctx.db.get(args.taskId);

    if (!task) {
      throw new Error("Not found");
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    if (task.userId !== userId) {
      throw new Error("Not authorized");
    }
    return task;
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    status: v.optional(v.string()),
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

    const task = await ctx.db.patch(args.id, {
      ...rest,
    });

    return task;
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

