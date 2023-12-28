import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { CardAllUsers } from "./card-all-users";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

interface Users {
  _id: string;
  _creationTime: number;
  userId: string;
  avatarUrl: string;
  name: string;
}

export default function AllUsers() {

  const users = useQuery(api.users.get)
  const currentUser = useUser().user?.id

  return (
    <div className="w-full mx-auto space-y-4" >
      {users?.map(user => {
        return (
          user.userId !== currentUser ? (
            <CardAllUsers
              key={user._id}
              _id={user.userId}
              name={user.name ?? ""}
              _creationTime={user._creationTime ?? 0}
              avatarUrl={user.avatarUrl ?? ""}
            />
          ) : null
        );
      })}
    </div>
  )
}

CardAllUsers.Skeleton = function CardMessageSkeleton() {
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

