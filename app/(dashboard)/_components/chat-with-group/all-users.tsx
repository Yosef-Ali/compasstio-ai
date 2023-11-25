import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

import { CardMessage } from "./card-message";

import { ChatCard } from "../chat-with-ai/chat-card";
import { group } from "console";
import { CardAllUsers } from "./card-all-users";
import { useUser } from "@clerk/nextjs";
import { CardGroup } from "./card-groups";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
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
  )
}

CardGroup.Skeleton = function CardMessageSkeleton() {
  return (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  )
}

