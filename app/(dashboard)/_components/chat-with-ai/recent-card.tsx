"use client"

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { ChatCard } from "../chat-with-ai/chat-card";



interface Chatbot {
  _id: Id<"chatbots">;
  _creationTime: number;
  avatarUrl?: string;
  name?: string;
  description?: string;
  intents?: string;
  responses?: string;
  context?: string;
  botId: string;
  isPinned: boolean;
}

export default function CardRecentChatBots() {

  const chatbots = useQuery(api.chatbots.get) as Chatbot[];
  const { isLoading } = useConvexAuth()

  if (chatbots === undefined || isLoading) {
    return (
      <div className="space-y-3">
        <ChatCard.Skeleton />
        <ChatCard.Skeleton />
        <ChatCard.Skeleton />
      </div>
    );
  };

  return (

    <div className="grid grid-cols-1 gap-4 p-3">
      {chatbots?.map(chatbot => {
        return (
          <ChatCard
            key={chatbot._id}
            botId={chatbot.botId}
            name={chatbot.name ?? ''}
            description={chatbot.description ?? ''}
            creationTime={chatbot._creationTime}
            onClick={() => { }}
          />
        );
      })}
    </div>
  );
}
