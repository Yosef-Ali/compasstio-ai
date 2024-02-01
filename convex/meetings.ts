import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveMeetingId = mutation({
  args: {
    meetingId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }
      const userId = identity.subject as string;

      await ctx.db.insert("meetings", {
        userId,
        meetingId: args.meetingId
      });
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while saving the meeting ID");
    }
  },
});

export const removeMeeting = mutation({
  args: { meetingId: v.string(), },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const userId = identity?.subject;

    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const meeting = await ctx.db
      .query("meetings")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("meetingId"), args.meetingId))
      .first()

    if (!meeting) {
      throw new Error("Meeting not found");
    }
    await ctx.db.delete(meeting._id);
  },
});

export const get = query(async ({ db }) => {
  return await db.query("meetings").order("desc").collect();
});



