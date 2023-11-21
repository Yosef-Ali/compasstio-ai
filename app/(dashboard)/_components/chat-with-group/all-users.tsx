import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

import { CardMessage } from "./card-message";

import { ChatCard } from "../chat-with-ai/chat-card";
import { group } from "console";
import { CardAllUsers } from "./card-all-users";

interface Users {
  _id: Id<"users">;
  _creationTime: number;
  avatarUrl: string;
  // lastSeen: number;
  name: string;
  // status: string;
}

export default function AllUsers() {

  const users = useQuery(api.users.getAll)

  const { isLoading, isAuthenticated } = useConvexAuth();


  return isLoading || isAuthenticated ? (
    <div className="grid grid-cols-1 gap-4 p-3">
      {users?.map(user => {
        return (
          <CardAllUsers
            key={user._id}
            _id={user._id}
            name={user.name ?? ""}
            // lastSeen={user.lastSeen ?? ""}
            // status={user.status ?? ""}
            _creationTime={user._creationTime ?? 0}
            avatarUrl={user.avatarUrl ?? ""}
          />
        );
      })}
    </div>
  ) : (
    <div className="space-y-3">
      <CardMessage.Skeleton />
      <CardMessage.Skeleton />
      <CardMessage.Skeleton />
    </div>
  );
}

