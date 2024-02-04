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


export const getMeeting = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.query("meetings")
      .filter((q) => q.eq(q.field("meetingId"), args.id))
      .first()
    if (!meeting) {
      throw new Error("Meeting not found");
    }
    return meeting;
  }
})

export const getMeetingByUserId = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const meeting = await ctx.db.query("meetings")
        .filter((q) => q.eq(q.field("userId"), args.id))
        .first()
      if (!meeting) {
        throw new Error("Meeting not found");
      }
      return meeting;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while fetching the meeting");
    }
  }
})

export const getParticipantByUserId = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const meeting = await ctx.db.query("meetings")
        .filter((q) => q.eq(q.field("userId"), args.id))
        .first()

      // if (!meeting) {
      //   throw new Error("Meeting not found");
      // }
      return meeting?.participants;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while fetching the meeting");
    }

  }
})

export const getParticipantByUseParam = query({
  args: {
    meetingId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const meeting = await ctx.db.query("meetings")
        .filter((q) => q.eq(q.field("meetingId"), args.meetingId))
        .first()

      // if (!meeting) {
      //   throw new Error("Meeting not found");
      // }
      return meeting?.participants;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while fetching the meeting");
    }

  }
})



// Define the saveParticipant mutation
export const saveParticipant = mutation({
  // Define the arguments for the mutation
  args: {
    meetingId: v.string(),
    participant: v.object({ // Rename field to match usage
      userId: v.string(),
      participantId: v.string(),
    }),
  },
  // Define the handler function for the mutation
  handler: async (ctx, args) => {

    const identity = await ctx.auth.getUserIdentity();

    const currentUserId = identity?.subject;
    // Find the meeting document by meetingId
    const meeting = await ctx.db.query("meetings") // Use the api.meetings type
      .filter((q) => q.eq(q.field("meetingId"), args.meetingId))
      .first();

    // Throw an error if the meeting is not found
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    // Define a custom equality function for the nested objects
    function isEqual(a: { userId: string; participantId: string }, b: { userId: string; participantId: string }) {
      return a.userId === b.userId && a.participantId === b.participantId;
    }

    // Get the current participants as an array or an empty array
    const participantIds = Array.from(
      meeting.participants?.map((p) => ({ userId: p.userId, participantId: p.participantId })) || []
    );

    // Create a new participant object with the values from args
    const newParticipant = { ...args.participant };

    // Check if the array already has the new participant using the custom equality function
    if (!participantIds.some((p) => isEqual(p, newParticipant))) {
      // Add the new participant to the array
      participantIds.push(newParticipant);
    }

    if (participantIds[0].userId === currentUserId) { // Add the condition
      await ctx.db.patch(meeting._id, { // Use the ctx.db.patch method
        participants: participantIds, // Rename the field to match the schema
      }); // Add a semicolon
    }
  }

}); // Add a semicolon


export const getParticipantUserIds = query({
  args: {
    meetingId: v.string(),
  },
  handler: async (ctx, args) => {
    // Query the meetings table by meetingId
    const meeting = await ctx.db.query("meetings")
      .filter((q) => q.eq(q.field("meetingId"), args.meetingId))
      .first();

    if (!meeting) {
      throw new Error("Meeting not found");
    }

    // Get the userIds from the participants field
    const userIds = meeting.participants?.map((p) => p.userId);

    // Return the userIds as an array
    return userIds;
  },
});