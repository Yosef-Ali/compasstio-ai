// // Define a query function to get all messages between two users
// query(async ({ db }, { user1, user2 }) => {
//   // Get all messages from the Message table
//   const messages = await db.getAll(Message);
//   // Filter messages by sender and receiver
//   chatmessages = messages.filter(
//     (message) =>
//       (message.sender === user1 && message.receiver === user2) ||
//       (message.sender === user2 && message.receiver === user1)
//   );
//   // Sort messages by creation time in ascending order
//   messages.sort((a, b) => a._creationTime - b._creationTime);
//   // Return the messages array
//   return messages;
// });

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const get = query(async ({ db }, { sender, receiver }) => {
  const messages = await db.query("chatMessages").collect();

  if (!messages) {
    throw new Error("No messages found");
  }
  const chatmessages = messages.filter(
    (message) =>
      (message.sender === sender && message.receiver === receiver) ||
      (message.sender === receiver && message.receiver === sender)
  );
  chatmessages.sort((a, b) => a._creationTime - b._creationTime);
  return chatmessages;
});

export const create = mutation({
  args: {
    sender: v.string(),
    receiver: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMessages", {
      sender: args.sender,
      receiver: args.receiver,
      content: args.content,
    });
  },
});
