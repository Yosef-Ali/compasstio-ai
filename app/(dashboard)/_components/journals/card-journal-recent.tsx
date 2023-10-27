
"use client"
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ChatCard } from "../chat-with-ai/chat-card";

interface ChatCardProps {
  data: Doc<"journals">;
  onClick: () => void;
}


export default function CardRecentJournal() {
  const journals = useQuery(api.journals.get)

  if (journals === undefined) {
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
      {journals.map(journal => {

        if (!journal || !journal.title) {
          return null;
        }

        return (
          <ChatCard
            key={journal._id}
            title={journal.title}
            description={journal.title}
            creationTime={journal._creationTime}
            onClick={() => { }}
          />
        )
      })}
    </div>
  );
}
