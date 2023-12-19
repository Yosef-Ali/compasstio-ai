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
    conversationId: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_conversationId", ["conversationId"]),

  chatMessages: defineTable({
    _id: v.string(),
    _creationTime: v.number(),
    sender: v.string(),
    receiver: v.string(),
    content: v.string(),
  }),

  // groups: defineTable({
  //   _id: v.string(),
  //   _creationTime: v.number(),
  //   userId: v.string(),
  //   name: v.string(),
  //   description: v.string(),
  //   avatarUrl: v.string(),
  //   isBlocked: v.boolean(),
  // }).index("by_user", ["userId"]),

  friends: defineTable({
    user_Id: v.string(),
    friend_Id: v.string(),
    isBlocked: v.boolean(),
  })
    .index("by_userId", ["user_Id"])
    .index("by_friendId", ["friend_Id"]),

  users: defineTable({
    avatarUrl: v.string(),
    bio: v.string(),
    name: v.string(),
    onboarded: v.boolean(),
    userId: v.string(),
    username: v.string(),
  }).index("by_username", ["username"]),


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
    content: v.string(),
    sender_id: v.string(),
    receiver_id: v.string(),
    read: v.boolean(),
  })
    .index("by_sender_id", ["sender_id"])
    .index("by_receiver_id", ["receiver_id"]),

});



