// import { v } from "convex/values";
// import { mutation, query } from "./_generated/server";

// export const get = query({
//   handler: async (ctx) => {
//     try {
//       const identity = await ctx.auth.getUserIdentity();

//       if (!identity) {
//         throw new Error("Not authenticated");
//       }

//       const users = await ctx.db.query("users").collect();

//       return users;
//     } catch (err) {
//       // Log the error
//       console.error(err);

//       // Return a meaningful response to the user
//       return {
//         statusCode: 500,
//         body: {
//           message: "An error occurred while fetching the journals.",
//         },
//       };
//     }
//   },
// });
