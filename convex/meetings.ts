import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";



export const getMeetings = query({
  handler: async (ctx) => {
    const meetings = await ctx.db
      .query("meetings")
      .collect();

    if (!meetings.length) {
      return null;
    }

    const identity = await ctx.auth.getUserIdentity();

    const email = identity?.email;

    if (!email) {
      throw new Error("Unauthenticated");
    }

    if (meetings.length) {
      const filteredMeetings = meetings.filter((meeting) => meeting.groupsId?.includes(email));
      return filteredMeetings;
    }
  },
});


export const getMeetingList = query({
  args: {
    meetingId: v.string(),
  },
  handler: async (ctx, args) => {
    const meetings = await ctx.db
      .query("meetings")
      .filter((q) => q.eq(q.field("meetingId"), args.meetingId))
      .first();

    if (!meetings) {
      throw new Error("Meeting not found");
    }

    const groupsExist = meetings.groupsId?.map((groupId) =>
      ctx.db.query("groups").filter((q) => q.eq(q.field("_id"), groupId)).first()
    );

    return groupsExist
  },
});

export const removeMeeting = mutation({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const userId = identity?.subject;

    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const meeting = await ctx.db
      .query("meetings")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first()

    if (!meeting) {
      throw new Error("Meeting not found");
    }
    await ctx.db.delete(meeting._id);
  },
});

export const saveMeetingId = mutation({
  args: {
    meetingId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Get the user identity or throw an error
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }
      const userId = identity.subject as string;

      // Check if the meeting already exists or throw an error
      const existingMeeting = await ctx.db
        .query("meetings")
        .filter((q) => q.eq(q.field("meetingId"), args.meetingId))
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      // if (existingMeeting) {
      //   // clear the meeting id
      //   await ctx.db.delete(existingMeeting._id);
      //   return
      // }

      if (existingMeeting) {
        throw new Error("Meeting already exists");
      }
      const orphanMeetings = await ctx.db
        .query("meetings")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      if (orphanMeetings.length > 0) {
        await ctx.db.delete(orphanMeetings[0]._id);
      }

      // Save the meeting ID to the database
      await ctx.db.insert("meetings", {
        userId,
        meetingId: args.meetingId
      });
    } catch (error) {
      // Handle the error here
    }
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
    try {
      const meeting = await ctx.db.query("meetings")
        .filter((q) => q.eq(q.field("meetingId"), args.id))
        .first()
      return meeting;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while fetching the meeting");
    }
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



export const saveGroupsInMeeting = mutation({
  args: {
    meetingId: v.string(),
    groupId: v.optional(v.id("groups")), // Make the argument optional
  },
  handler: async (ctx, args) => {
    try {
      const meeting = await ctx.db
        .query("meetings")
        .filter((q) => q.eq(q.field("meetingId"), args.meetingId))
        .first();

      if (!meeting) {
        throw new Error("Meeting not found");
      }

      // Retrieve group details (including email if applicable)
      const selectedGroup = await ctx.db
        .query("groups")
        .filter((q) => q.eq(q.field("_id"), args.groupId as Id<"groups">))
        .first();

      if (!selectedGroup) {
        throw new Error("Group not found");
      }

      const selectedMembers = selectedGroup?.members;

      if (selectedMembers && meeting.groupsId) {
        // Update meeting with existing + new group data
        await ctx.db.patch(meeting._id, {
          groupsId: [...meeting.groupsId, ...selectedMembers], // Only spread if defined
        });
      } else if (selectedMembers) {
        // Update meeting with new group data
        await ctx.db.patch(meeting._id, {
          groupsId: selectedMembers,
        });
      }
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while saving the meeting");
    }
  },
});


export const removeGroupsInMeeting = mutation({
  args: {
    meetingId: v.string(),
    groupId: v.optional(v.id("groups")), // Make the argument optional
  },
  handler: async (ctx, args) => {
    try {
      const meeting = await ctx.db
        .query("meetings")
        .filter((q) => q.eq(q.field("meetingId"), args.meetingId))
        .first();

      if (!meeting) {
        throw new Error("Meeting not found");
      }

      // Retrieve group details (including email if applicable)
      const selectedGroup = await ctx.db
        .query("groups")
        .filter((q) => q.eq(q.field("_id"), args.groupId as Id<"groups">))
        .first();

      if (!selectedGroup) {
        throw new Error("Group not found");
      }

      const selectedMembers = selectedGroup?.members;
      // console.log("selectedMembers", selectedMembers);

      if (selectedMembers && meeting.groupsId) {
        // Update meeting with existing + new group data
        const updatedGroupsId = meeting.groupsId.filter(
          (groupId) => !selectedMembers.includes(groupId)
        );

        await ctx.db.patch(meeting._id, {
          groupsId: updatedGroupsId,
        });
      }
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while saving the meeting");
    }
  },
});



export const removeGroupId = mutation({
  args: {
    meetingId: v.string(),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const meeting = await ctx.db
        .query("meetings")
        .filter((q) => q.eq(q.field("meetingId"), args.meetingId))
        .first();

      if (!meeting) {
        // throw new Error("Meeting not found");
        return null
      }

      if (!meeting.groupsId) {
        throw new Error("Groups ID field not found in meeting document");
      }

      const updatedGroupsId = meeting.groupsId.filter(
        (groupId) => groupId !== args.id
      );

      await ctx.db.patch(meeting._id, { groupsId: updatedGroupsId });
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while removing the group ID");
    }
  },
});

