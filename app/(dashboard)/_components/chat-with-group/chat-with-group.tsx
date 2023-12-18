import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

import { CardMessage } from "./card-message";
import { CardFriends } from "./card-friends";

interface FriendsProps {
  _id: Id<"friends">;
  friends_Id: Id<"users">
  _creationTime: number;
  isBlocked: boolean;
}

export default function Friends() {
  const friends = useQuery(api.friends.listFriends)


  const { isLoading } = useConvexAuth()

  if (friends === undefined || isLoading) {
    return (
      <div className="space-y-3">
        <CardMessage.Skeleton />
        <CardMessage.Skeleton />
        <CardMessage.Skeleton />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {friends?.map(friend => {
        return (
          <CardFriends
            key={friend._id}
            _id={friend._id}
            friends_Id={friend.friend_Id}
            _creationTime={friend._creationTime ?? 0}
            isBlocked={friend.isBlocked}
          />
        );
      })}
    </div>
  );
}


