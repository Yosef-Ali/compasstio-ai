/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.5.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as chatMesseges from "../chatMesseges";
import type * as chatbots from "../chatbots";
import type * as chats from "../chats";
import type * as groupMessages from "../groupMessages";
import type * as groups from "../groups";
import type * as journals from "../journals";
import type * as messages from "../messages";
import type * as product from "../product";
import type * as tasks from "../tasks";
import type * as users from "../users";

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
  groupMessages: typeof groupMessages;
  groups: typeof groups;
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
