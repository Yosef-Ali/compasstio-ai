import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { CardMessage } from "./card-message";
import { CardFriends } from "./card-friends";
import useActiveFriendStore from "@/app/hooks/useActiveFriend";
import { useEffect, useState } from "react";

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
  const { activeFriendId } = useActiveFriendStore();
  const { isLoading } = useConvexAuth();
  const [sortedFriends, setSortedFriends] = useState<FriendsProps[]>([]);

  const handleResort = () => {

    if (!friends) return;

    const sorted = [...friends];

    const activeIndex = sorted.findIndex(f => f._id === activeFriendId);

    if (activeIndex > -1) {
      const activeFriend = sorted.splice(activeIndex, 1)[0];
      sorted.unshift(activeFriend);
    }

    setSortedFriends(sorted);

  }

  useEffect(() => {

    handleResort();

  }, [friends, activeFriendId]);

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
