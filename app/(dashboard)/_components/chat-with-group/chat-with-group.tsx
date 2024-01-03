
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

import { CardMessage } from "./card-message";
import { CardFriends } from "./card-friends";



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
    <div className="flex flex-col space-y-4">
      {Object.values(friends ?? {}).map(message => (
        <CardFriends
          key={message._id}
          friends_Id={message.sender_id}
          _creationTime={message._creationTime ?? 0}
          message={message.content}
          isRead={message.isRead}
        />
      ))}
    </div>
  );
}


