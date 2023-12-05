"use client"
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { ChatCardPinned } from "./card-pinned-chat"


export default function CardRecentChatBots(){

  const { isLoading } = useConvexAuth()
  const chats = useQuery(api.chats.getPinnedChats);

  if (!chats) {
    return null;
  }



  if (chats === undefined || isLoading) {
    return (
      <div className="space-y-3">
        <ChatCardPinned.Skeleton />
        <ChatCardPinned.Skeleton />
        <ChatCardPinned.Skeleton />
      </div>
    );
  };

  return (

    <div className="grid grid-cols-1 gap-4 p-3">
      {chats?.map(chat => {
        return (
          <ChatCardPinned
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
