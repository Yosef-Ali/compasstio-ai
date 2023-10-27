"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { ChatCard } from "../chat-with-ai/chat-card";

interface CardData {
  title: string;
  description: string;
}

interface ChatCardProps {
  title: string;
  description: string;
  creationTime: number;
  onClick: () => void;
}



export default function CardArchiveJournal() {
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
      {journals.map(journal => (
        <ChatCard
          key={journal._id}
          title={journal.title}
          description={journal.title}
          creationTime={journal._creationTime}
          onClick={() => { }}
        />
      ))}
    </div>
  );
}