import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { useId } from "react";

export default defineSchema({
  journals: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  }).index("by_user", ["userId"]),

  chatbots: defineTable({
    botId: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    intents: v.optional(v.string()),
    responses: v.optional(v.string()),
    context: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isPinned: v.boolean(),
  }).index("by_botId", ["botId"]),

  chats: defineTable({
    userId: v.string(),
    prompt: v.string(),
    result: v.string(),
    isPinned: v.boolean(),
  }),

  chatMessages: defineTable({
    _id: v.string(),
    _creationTime: v.number(),
    sender: v.string(),
    receiver: v.string(),
    content: v.string(),
  }),

  groups: defineTable({
    _id: v.string(),
    _creationTime: v.number(),
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    avatarUrl: v.string(),
  }).index("by_user", ["userId"]),

  users: defineTable({
    _id: v.string(),
    _creationTime: v.number(),
    userId: v.string(),
    name: v.string(),
    username: v.string(),
    avatarUrl: v.string(),
    bio: v.string(),
    onboarded: v.boolean(),
  }).index("by_userId", ["userId"]),

  tasks: defineTable({
    _id: v.string(),
    _creationTime: v.number(),
    title: v.string(),
    userId: v.string(),
    description: v.union(v.string(), v.null()),
    dueDate: v.union(v.number(), v.null()),
    status: v.union(v.string(), v.null()),
  }).index("by_user", ["userId"]),

  messages: defineTable({
    message_content: v.string(),
    recipient_id: v.string(),
    seen_at: v.union(v.null(), v.string()),
    sender_id: v.string(),
    sent_at: v.string(),
  })
    .index("by_sender", ["sender_id"])
    .index("by_recipient", ["recipient_id"]),

  // Messages
  Messages: defineTable({
    _id: v.string(),
    _creationTime: v.number(),
    senderId: v.string(),
    receiverId: v.string(),
    content: v.string(),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"]),

  // Invitations
  Invitations: defineTable({
    _id: v.string(),
    _creationTime: v.number(),
    senderId: v.string(),
    receiverId: v.string(),
    status: v.union(v.string(), v.null()),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"]),

  // Connections
  Connections: defineTable({
    _id: v.string(),
    _creationTime: v.number(),
    userId: v.string(),
    connectionId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_connection", ["connectionId"]),
});
