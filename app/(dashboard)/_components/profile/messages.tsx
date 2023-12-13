import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { CardProfileMessage } from "./card-profile-messages";

import { SetStateAction, useState } from "react";

interface Group {
  _id: Id<"groups">;
  name: string;
  description: string;
  _creationTime: number;
  avatarUrl: string;
}


export default function Messages() {

  const groups = useQuery(api.groups.get) as Group[] | undefined;


  const { isLoading } = useConvexAuth()

  if (groups === undefined || isLoading) {
    return (
      <div className="space-y-3">
        <CardProfileMessage.Skeleton />
        <CardProfileMessage.Skeleton />
        <CardProfileMessage.Skeleton />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {groups?.map(group => {
        return (
          <CardProfileMessage
            key={group._id}
            name={group.name ?? " "}
            content = {group.description ?? " "}
            creationTime={group._creationTime ?? 0}
            avatarUrl={group.avatarUrl ?? " "}
          />
        );
      })}
    </div>
  );
}

