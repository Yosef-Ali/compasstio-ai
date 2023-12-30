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
          message: "An error occurred while fetching the journals.",
        },
      };
    }
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


