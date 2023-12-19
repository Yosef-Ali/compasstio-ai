import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// export const listFriends = query({
//   args: {
//     id: v.id("users"),
//   },
//   handler: async (ctx, args) => {
//     // use `args` and/or `ctx.auth` to authorize the user
//     // ...
//     const identity = ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new Error("Not authorized");
//     }
//     const friends = await ctx.db.get(args.id)

//     if (!friends) {
//       throw new Error("Not found");
//     }
//     return friends;
//   }
// })

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
        .collect()

      if (!friends) {
        throw new Error("Not found");
      }
      return friends;
    }
    catch (error) {
      // Log the error
      console.error(error);
    }

  }

})

// export const createFriend = mutation({
//   args: {
//     friendId: v.id("users"),
//   },
//   handler: async (ctx, args) => {
//     try {
//       const identity = await ctx.auth.getUserIdentity();

//       if (!identity) {
//         throw new Error("Not authenticated");
//       }

//       const existingUser = identity.subject

//       const friend_Id = args.friendId
//       const user_Id = existingUser
//       const isBlocked = false

//       const newFriendship = await ctx.db.insert("friends", {
//         user_Id: user_Id || "",
//         friend_Id,
//         isBlocked: isBlocked || false,
//       })

//       if (!newFriendship) {
//         throw new Error("Not found");
//       }

//       return newFriendship;

//     }
//     catch (error) {
//       // Log the error
//       console.error(error);
//     }
//   }

// })

export const createFriend = mutation({
  args: {
    friendId: v.string(),
  },
  handler: async (ctx, args) => {


    const identity = await ctx.auth.getUserIdentity();

    const friend_Id = args.friendId
    const user_Id = identity?.subject
    const isBlocked = false

    console.log('user_Id:', user_Id)

    const newFriendship = await ctx.db.insert("friends", {
      user_Id: user_Id || "",
      friend_Id,
      isBlocked: isBlocked || false,
    })

    if (!newFriendship) {
      throw new Error("Not found");
    }

    return newFriendship;

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
      const user = await ctx.db.query("users")
        .filter((q) => q.eq(q.field("userId"), senderId))
        .first();

      const friend = await ctx.db.query("friends")
        .filter((q) => q.eq(q.field("friend_Id"), args.friendId))
        .filter((q) => q.eq(q.field("user_Id"), senderId))
        .filter((q) => q.eq(q.field("isBlocked"), false))
        .first();

      if (!friend) {
        return null;
      }

      const isBlocked = await ctx.db.patch(friend._id, {
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



