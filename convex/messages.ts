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

      const messages = await ctx.db.query("messages").collect();
      if (!messages) {
        throw new Error("No messages found");
      }

      return messages;
    } catch (error) {
      // Log the error
      console.error(error);

      // Return a meaningful response to the user
      return {
        statusCode: 500,
        body: {
          message: "An error occurred while fetching the messages.",
        },
      };
    }
  },
});


// The code snippet retrieves the sender information of messages received by the authenticated user. It filters the messages, retrieves the sender IDs, filters the friends based on the sender IDs, removes duplicates, and returns the unique friends. If an error occurs, it logs
export const getFriendSender = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }
      const userId = identity.subject;

      const messages = await ctx.db.query("messages")
        .filter((q) => q.eq(q.field("receiver_id"), userId))
        .order("desc")
        .collect();

      console.log('messages:::', messages)

      const senderIds = messages.map((message) => message.sender_id);
      //@ts-ignore
      const uniqueSenderIds = [...new Set(senderIds)];


      console.log('senderIds:::', uniqueSenderIds)

      return uniqueSenderIds;
    } catch (error) {
      // Log the error
      console.error(error);
      // Return a meaningful response to the user
      return {
        statusCode: 500,
        body: {
          message: "An error occurred while fetching the messages.",
        },
      };
    }
  },
});

export const friendsWithMessages = query({
  handler: async (ctx) => {
    // Get the current user's id
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    // Get the messages that were sent to the current user
    const messages = await ctx.db.query("messages")
      .filter((q) => q.eq(q.field("receiver_id"), userId))
      // Order by the message creation time
      .order("desc")
      // Collect the results
      .collect();
    // Get the ids of the message senders
    const senderIds = messages.map((message) => message.sender_id);
    // Get the friends who are not blocked and who match the sender ids
    const friends = await ctx.db.query("friends")
      .filter((q) => q.eq(q.field("isBlocked"), false))
      // Use the or operator to filter by the sender ids
      .filter((q) => q.or(
        // Map the sender ids to filter builders
        ...senderIds.map((senderId) => q.eq(q.field("user_Id"), senderId))
      ))
      // Collect the results
      .collect();
    // Get the ids of the friends
    const friendIds = friends.map((friend) => friend.user_Id);
    // Get the user data of the friends

    console.log('friendIds::', friendIds)

    const users = await ctx.db.query("users")
      // Use the or operator to filter by the friend ids
      .filter((q) => q.or(
        // Map the friend ids to filter builders
        ...friendIds.map((friendId) => q.eq(q.field("userId"), friendId))
      ))
      // Collect the results
      .collect();

    console.log('users::', users)

    // Join the data from the three tables
    const joinedData = messages.map((message) => {
      // Find the friend document that matches the message sender id
      const friend = friends.find((f) => f.user_Id === message.sender_id);
      // Find the user document that matches the friend id
      const user = users.find((u) => u.userId === friend?.user_Id);
      // Return an object that contains the data from the three tables
      return {
        message: message,
        friend: friend,
        user: user,
      };
    });
    // Return the joined data

    console.log('joinedData', joinedData)
    return joinedData;
  },
});




export const getMessages = query({
  args: {
    receiver_id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const senderId = identity.subject;

    //console.log('args.receiver_id', args.receiver_id)

    const filteredMessages = await ctx.db.query("messages")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("sender_id"), senderId),
            q.eq(q.field("receiver_id"), args.receiver_id)
          ),
          q.and(
            q.eq(q.field("sender_id"), args.receiver_id),
            q.eq(q.field("receiver_id"), senderId)
          )
        )
      )
      .order("asc")
      .collect();

    return filteredMessages;

  }
})

export const getLatestMessages = query({
  args: {
    receiver_id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const senderId = identity.subject;
    //const receiverId = args.receiver_id. as Id<"users">;

    console.log('args.receiver_id', args.receiver_id)

    const filteredMessages = await ctx.db.query("messages")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("sender_id"), senderId),
            q.eq(q.field("receiver_id"), args.receiver_id)
          ),
          q.and(
            q.eq(q.field("sender_id"), args.receiver_id),
            q.eq(q.field("receiver_id"), senderId)
          )
        )
      )
      .filter((q) => q.eq(q.field("sender_id"), args.receiver_id))
      .order("desc")
      .first();


    console.log('filteredMessages', filteredMessages)

    return filteredMessages;

  }
})



export const create = mutation({
  args: {
    content: v.string(),
    receiver_id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const senderId = identity.subject as string;

    console.log('senderId at create', senderId)
    console.log('args.receiver_id at create', args.receiver_id)

    const messages = await ctx.db.insert("messages", {
      content: args.content,
      sender_id: senderId,
      receiver_id: args.receiver_id,
      read: false,
    });

    return messages;
  },
});


