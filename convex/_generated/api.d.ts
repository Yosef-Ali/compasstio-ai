/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as chatMesseges from "../chatMesseges.js";
import type * as chats from "../chats.js";
import type * as clerk from "../clerk.js";
import type * as files from "../files.js";
import type * as friends from "../friends.js";
import type * as http from "../http.js";
import type * as httpStripe from "../httpStripe.js";
import type * as journals from "../journals.js";
import type * as liveSessionsGroups from "../liveSessionsGroups.js";
import type * as meetings from "../meetings.js";
import type * as messages from "../messages.js";
import type * as myFunctions from "../myFunctions.js";
import type * as product from "../product.js";
import type * as stripe from "../stripe.js";
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
  chats: typeof chats;
  clerk: typeof clerk;
  files: typeof files;
  friends: typeof friends;
  http: typeof http;
  httpStripe: typeof httpStripe;
  journals: typeof journals;
  liveSessionsGroups: typeof liveSessionsGroups;
  meetings: typeof meetings;
  messages: typeof messages;
  myFunctions: typeof myFunctions;
  product: typeof product;
  stripe: typeof stripe;
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
