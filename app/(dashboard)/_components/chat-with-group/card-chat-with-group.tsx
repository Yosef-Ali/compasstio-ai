"use client"

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ChatCard } from "../chat-with-ai/chat-card";
import { CardMessage } from "./chard-messege";

export default function CardChatWithGroup() {
  const journals = useQuery(api.journals.get)

  if (journals === undefined) {
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
      {journals.map(journal => {
        return (
          <CardMessage
            key={journal._id}
            title={journal.title}
            description={journal.title}
            creationTime={journal._creationTime}
            onClick={() => { }}
          />
        );
      })}
    </div>

  );
}



