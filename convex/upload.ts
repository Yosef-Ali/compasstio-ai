import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const sendImage = mutation({
  args: { storageId: v.id("_storage"), author: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("Storage", {
      storageId: args.storageId,
      author: args.author,

    });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});




export const imageSaved = mutation({
  args: { storageId: v.id("_storage"), author: v.string() },

  handler: async (ctx, args) => {
    await ctx.db.insert("Storage", {
      storageId: args.storageId,
      author: args.author,
      imageUrl: await ctx.storage.getUrl(args.storageId) || undefined
    });
  },
})


export const saveStorageId = mutation({
  // You can customize these as you like
  args: {
    uploaded: v.object({
      storageId: v.string(),
    }),
    // other args...
  },
  handler: async (ctx, args) => {
    // use `args` and/or `ctx.auth` to authorize the user
    // ...

    // Save the storageId to the database using `insert`
    ctx.db.insert("Storage", {
      storageId: args.uploaded.storageId,
      author: ""
    });
    // or `patch`/`replace`
    // ctx.db.patch(someId, {
    //   storageId: args.uploaded.storageId,
    //   // ...
    // });
  },
});
