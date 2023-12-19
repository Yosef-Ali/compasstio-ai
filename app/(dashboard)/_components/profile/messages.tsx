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

  console.log('friendsMessges profile:', friends)


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
    <div className="grid grid-cols-1 gap-4 p-3">
      {friends?.map(friend => {
        return (
          <CardProfileMessage
            _id={friend._id}
            key={friend._id}
            friends_Id={friend.friend_Id}
            _creationTime={friend._creationTime ?? 0}
            isBlocked={friend.isBlocked}
          />
        );
      })}
    </div>
  );
}

