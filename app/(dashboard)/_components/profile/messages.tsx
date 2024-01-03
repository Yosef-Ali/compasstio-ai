import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { CardProfileMessage } from "./card-profile-messages";

import { SetStateAction, useState } from "react";

interface FriendsProps {
  _id: string;
  friends_Id: string
  _creationTime: number;
  isBlocked: boolean;
}

export default function Messages() {

  const friends = useQuery(api.friends.listFriends)

  const { isLoading } = useConvexAuth()

  if (friends === undefined || isLoading) {
    return (
      <div className="space-y-3">
        <CardProfileMessage.Skeleton />
        <CardProfileMessage.Skeleton />
        <CardProfileMessage.Skeleton />
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-4">
      {Object.values(friends ?? {}).map(message => (
        <CardProfileMessage
          key={message._id}
          _id={message._id}
          friends_Id={message.sender_id}
          _creationTime={message._creationTime ?? 0}
          message={message.content}
        />
      ))}
    </div>
  );
}

