import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";


export const getMembersInfo = query({
  args: {
    groupId: v.optional(v.id("groups")),
  },
  handler: async (ctx, args) => {
    try {
      const group = await ctx.db
        .query("groups")
        .filter((q) => q.eq(q.field("_id"), args.groupId))
        .collect();

      if (group.length === 0) {
        throw new Error("Group not found");
      }

      const members = group[0].members;

      if (!members) {
        throw new Error("Members not found");
      }

      const users = await ctx.db.query("users").collect();

      return members.map((member) => {
        const user = users.find((user) => user.email === member);
        return {
          name: user ? user.name : null,
          username: user ? user.username : null,
        };
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  },
});

export const getMembers = query({
  args: {
    groupId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const members = await ctx.db
        .query("groups")
        .filter((q) => q.eq(q.field("_id"), args.groupId))
        .unique();
      return members;
    } catch (error) {
      console.error("Failed to retrieve group members:", error);
      // Depending on your application's needs, you might throw an error, return `null`, or return a custom error message.
      throw new Error("Error retrieving group members.");
    }
  },
});



export const getGroups = query({
  args: {
    userId: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
  
})

export const addMember = mutation({
  args: {
    groupId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {

    const group = await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("_id"), args.groupId))
      .first()

    if (!group) {
      throw new Error("Group not found");
    }

    await ctx.db.patch(group._id, {
      members: [...group.members, args.userId]
    })

  }
})

export const removeMember = mutation({
  args: {
    groupId: v.id("groups"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("_id"), args.groupId))
      .first()
    if (!group) {
      throw new Error("Group not found");
    }
    await ctx.db.patch(group._id, {
      members: group.members.filter((member) => member !== args.userId)
    })
  },
})


export const get = query(async ({ db }) => {
  return await db.query("groups").order("desc").collect();
})

export const create = mutation({
  args: {
    title: v.string(),
    userId: v.string(),
    members: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("groups", {
      title: args.title,
      userId: args.userId,
      members: [...args.members]
    })
  }
})

export const remove = mutation({
  args: {
    _id: v.id("groups"),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }
      await ctx.db.delete(args._id);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete group.");
    }
  },
});


export const update = mutation({
  args: {
    groupId: v.id("groups"),
    title: v.optional(v.string()),
    members: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.patch(args.groupId, {
        title: args.title,
        members: [...args.members || []]
      })
    } catch (error) {
      console.log(error);
    }
  }
})