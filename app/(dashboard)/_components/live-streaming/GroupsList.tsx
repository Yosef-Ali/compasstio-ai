"use client"

import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { CardGroupList } from "./card-live-grouplist";
import { useUser } from "@clerk/nextjs";
import useMeetingIdStore from "@/app/hooks/useMeetingIdStore";

export default function ParticipantList() {

  const { user } = useUser();

  const groups = useQuery(api.liveSessionsGroups.getGroups, {
    userId: user?.id as string,
  })

  console.log("groups:::", groups)
  console.log("user:::", user?.id)

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {groups ?
        groups.map((group) => {
          return (
            <CardGroupList
              key={group._id}
              userId={group.userId as string}
              title={group.title as string}
              members={group.members}
              groupId={group._id}
            />
          );
        })
        :
        <div className="text-center pt-4">No Participants</div>
      }
    </div>
  );
}