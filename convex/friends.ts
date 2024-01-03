import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

interface GroupedMessages {
  [key: string]: any;
}




// This code snippet exports a function called `listFriends1` that queries a database for a user's friends and their messages. It first checks if the user is authenticated, then retrieves the user's friends and filters out any blocked friends. It then retrieves
export const listFriends = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }
      const friends = await ctx.db
        .query("friends")
        .filter((q) => q.eq(q.field("user_Id"), identity.subject.toString()))
        .filter((q) => q.eq(q.field("isBlocked"), false))
        .order("desc")
        .collect()

      if (!friends) {
        throw new Error("Not found");
      }

      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.or(
          // Map the sender ids to filter builders
          ...friends.map((friend) => q.eq(q.field("sender_id"), friend.friend_Id))
        ))
        .filter((q) => q.eq(q.field("receiver_id"), identity.subject.toString()))
        .order("desc")
        .collect()

      const groupedMessages: { [key: string]: any } = messages.reduce((acc, cur) => {
        // If the sender id is not in the accumulator, add the current message
        //@ts-ignore
        if (!acc[cur.sender_id]) {
          //@ts-ignore
          acc[cur.sender_id] = cur;
        }
        // Otherwise, do nothing
        return acc;
      }, {});

      const keys = Object.keys(groupedMessages);
      const groupedMessagesArray = keys.map(key => groupedMessages[key]);

      return groupedMessagesArray;
    }
    catch (error) {
      // Log the error
      console.error(error);
    }

  }

})


export const createFriend = mutation({
  args: {
    friendId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const friend_Id = args.friendId;
    const user_Id = identity?.subject;
    const isBlocked = false;

    // Check if the friendship already exists
    const existingFriendship = await ctx.db
      .query("friends")
      .filter((q) => q.eq(q.field("user_Id"), user_Id))
      .filter((q) => q.eq(q.field("friend_Id"), args.friendId))
      .filter((q) => q.eq(q.field("isBlocked"), false))
      .first();

    if (existingFriendship) {
      throw new Error("Friendship already exists");
    }

    const newFriendship = await ctx.db.insert("friends", {
      user_Id: user_Id || "",
      friend_Id,
      isBlocked: isBlocked || false,
    });

    if (!newFriendship) {
      throw new Error("Failed to create friendship");
    }

    return newFriendship;
  }
});


export const deleteFriend = mutation({
  args: {
    friendId: v.string(),
  },
  handler: async (ctx, args) => {

    const identity = await ctx.auth.getUserIdentity();

    const friend_Id = args.friendId
    const user_Id = identity?.subject

    const deleteFriendship = await ctx.db.query("friends")
      .filter((q) => q.eq(q.field("user_Id"), user_Id))
      .filter((q) => q.eq(q.field("friend_Id"), friend_Id))
      .first();

    if (!deleteFriendship) {
      throw new Error("Not found");
    }
    const deleteFriend = await ctx.db.delete(deleteFriendship._id)

    return deleteFriend;

  }

})


export const isBlocked = mutation({
  args: {
    friendId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not authenticated");
      }

      const senderId = identity.subject;

      const friend = await ctx.db.query("friends")
        .filter((q) => q.eq(q.field("friend_Id"), args.friendId))
        .filter((q) => q.eq(q.field("user_Id"), senderId))
        .filter((q) => q.eq(q.field("isBlocked"), false))
        .first();

      if (!friend) {
        return null;
      }

      await ctx.db.patch(friend._id, {
        isBlocked: true
      })

      return friend;

    }

    catch (error) {
      // Log the error
      console.error(error);
    }

  }

})


export const allUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const user_Id = identity?.subject;

    // Collect only friend_Id values without select
    const notBlockedFriendIds = (await ctx.db.query("friends")
      .filter((q) => q.eq(q.field("user_Id"), user_Id))
      .filter((q) => q.eq(q.field("isBlocked"), false))
      .collect())
      .map((friend) => friend.friend_Id);

    const allUsers = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("userId"), user_Id))
      .filter((q) => q.and(
        ...notBlockedFriendIds.map((friend_Id) => q.neq(q.field("userId"), friend_Id))
      ))
      .collect();
    return allUsers;
  }
});




