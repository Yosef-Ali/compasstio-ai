import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  meetings: defineTable({
    userId: v.string(), // The creator user id
    meetingId: v.string(),
    title: v.optional(v.string()),
    groupsId: v.optional(v.array(v.string())),
  })
    .index("by_user", ["userId"])
    .index("by_meetingId", ["meetingId"]),

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
    email: v.optional(v.string()),
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

  groups: defineTable({
    userId: v.optional(v.string()), // The creator user id
    title: v.optional(v.string()),
    members: v.array(v.string()),
  })

});




