"use client"

import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { CardRecentChat } from "./card-recent-chat";
import { ChatCardPinned } from "./card-pinned-chat";


export default function CardRecentChatBots() {

  const { isLoading } = useConvexAuth()
  const chats = useQuery(api.chats.getChats);

  if (!chats) {
    return null;
  }

  if (chats === undefined || isLoading) {
    return (
      <div className="space-y-3">
        <CardRecentChat.Skeleton />
        <CardRecentChat.Skeleton />
        <CardRecentChat.Skeleton />
      </div>
    );
  };

  return (

    <div className="flex flex-col space-y-4">
      {chats?.map(chat => {
        return (
          <CardRecentChat
            key={chat._id}
            id={chat._id}
            prompt={chat.prompt ?? ''}
            result={chat.result ?? ''}
            creationTime={chat._creationTime}
          />
        );
      })}
    </div>
  );
}
