/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.6.3.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as chatMesseges from "../chatMesseges.js";
import type * as chatbots from "../chatbots.js";
import type * as chats from "../chats.js";
import type * as files from "../files.js";
import type * as friends from "../friends.js";
import type * as journals from "../journals.js";
import type * as messages from "../messages.js";
import type * as product from "../product.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  chatMesseges: typeof chatMesseges;
  chatbots: typeof chatbots;
  chats: typeof chats;
  files: typeof files;
  friends: typeof friends;
  journals: typeof journals;
  messages: typeof messages;
  product: typeof product;
  tasks: typeof tasks;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
