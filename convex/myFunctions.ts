import { queryGeneric } from "convex/server";
import { mutation, query } from "./_generated/server";

export const myMutation = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User identity not found");
    }
    return identity; // This will return the identity object including tokenIdentifier
  },
});