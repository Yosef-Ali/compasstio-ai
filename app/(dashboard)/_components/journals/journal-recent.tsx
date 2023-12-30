"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect } from "react";
//import { ChatCard } from "../chat-with-ai/card-recent-chat";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { JournalCard } from "./journal-card-recent";

interface Journal extends Doc<"journals"> {
  _id: Id<"journals">;
  description?: string;
  coverImage?: string;
  icon?: string;
  title: string;
  userId: string;
  isArchived: boolean;
  isPublished: boolean;
}


export default function RecentJournal() {
  const journals = useQuery(api.journals.get) as Journal[];
  const { isLoading } = useConvexAuth()

  if (journals === undefined || isLoading) {
    return (
      <div className="space-y-3">
        <JournalCard.Skeleton />
        <JournalCard.Skeleton />
        <JournalCard.Skeleton />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {journals?.map(journal => (
        <JournalCard
          key={journal._id}
          _id={journal._id}
          title={journal.title ?? " "}
          description={journal.content ?? " "}
          creationTime={journal._creationTime}
        />
      ))}
    </div>
  );
}