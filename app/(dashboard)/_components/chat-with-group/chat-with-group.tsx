import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { CardMessage } from "./card-message";
import { CardFriends } from "./card-friends";
import { Id } from "@/convex/_generated/dataModel";


interface FriendsProps {
  _id: Id<"friends">;
  _creationTime: number;
  user_Id: string;
  friend_Id: string;
  isBlocked: boolean;
  content?: string; // Add the content property with optional string type
  read?: boolean;
}

export default function Friends() {
  const friends = useQuery(api.friends.listFriends2);
  const { isLoading } = useConvexAuth();

  if (friends === undefined || isLoading) {
    return (
      <div className="space-y-3">
        <CardMessage.Skeleton />
        <CardMessage.Skeleton />
        <CardMessage.Skeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {friends?.map((friend: FriendsProps) => {
        const friendId = friend.friend_Id || friend.user_Id || "";
        return (
          <CardFriends
            key={friend._id}
            friends_Id={friendId}
            _creationTime={friend._creationTime ?? 0}
            message={friend.content ?? " "}
            isRead={friend.read ?? false}
          />
        );
      })}
    </div>
  );
}
