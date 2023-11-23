import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

import { CardMessage } from "./card-message";

import { ChatCard } from "../chat-with-ai/chat-card";
import { group } from "console";
import { CardAllUsers } from "./card-all-users";
import { useUser } from "@clerk/nextjs";

interface Users {
  _id: Id<"users">;
  _creationTime: number;
  userId: string;
  avatarUrl: string;
  // lastSeen: number;
  name: string;
  // status: string;
}

export default function AllUsers() {

  const users = useQuery(api.users.get)
  const currentUser = useUser().user?.id

  const { isLoading, isAuthenticated } = useConvexAuth();

  console.log("users:", users)
  console.log("users:", currentUser)


  return isLoading || isAuthenticated ? (
    <div className="grid grid-cols-1 gap-4 p-3">
      {users?.map(user => {
        console.log("user:", user.userId)
        return (
          user.userId !== currentUser ? (
            <CardAllUsers
              key={user._id}
              _id={user._id}
              userId={user.userId ?? ""}
              name={user.name ?? ""}
              // lastSeen={user.lastSeen ?? ""}
              // status={user.status ?? ""}
              _creationTime={user._creationTime ?? 0}
              avatarUrl={user.avatarUrl ?? ""}
            />
          ) : null
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

