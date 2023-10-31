import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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

  messages: defineTable({
    messageId: v.string(),
    chatId: v.string(),
    senderId: v.optional(v.string()),
    content: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isRead: v.boolean(),
  })
    .index("by_chat", ["chatId"])
    .index("by_sender", ["senderId"]),

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

  conversations: defineTable({
    id: v.string(),
    createdAt: v.number(),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    isPinned: v.boolean(),
  }),
});
