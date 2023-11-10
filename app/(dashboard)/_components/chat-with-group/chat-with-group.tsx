import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

import { CardMessage } from "./card-message";
import { CardGroup } from "./card-groups";
import { SetStateAction, useState } from "react";

interface Group {
  _id: Id<"groups">;
  name: string;
  description: string;
  _creationTime: number;
  avatarUrl: string;

}


export default function ChatWithGroup() {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const groups = useQuery(api.groups.get) as Group[];

  console.log("groups", groups)

  const { isLoading } = useConvexAuth()

  if (groups === undefined || isLoading) {
    return (
      <div className="space-y-3">
        <CardMessage.Skeleton />
        <CardMessage.Skeleton />
        <CardMessage.Skeleton />
      </div>
    );
  };

  const handleCardClick = (group: Group) => {
    setActiveGroupId(group._id);
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {groups?.map(group => {
        return (
          <CardGroup
            key={group._id}
            _id={group._id}
            name={group.name ?? " "}
            description={group.description ?? " "}
            _creationTime={group._creationTime ?? 0}
            avatarUrl={group.avatarUrl ?? " "}
            isActive={activeGroupId === group._id}
            {/* @ts-ignore */}
            onClick={() => handleCardClick(group)}
          />
        );
      })}
    </div>
  );
}

