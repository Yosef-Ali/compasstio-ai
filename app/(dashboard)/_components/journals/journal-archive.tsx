"use client"


import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { ChatCard } from "../chat-with-ai/chat-card";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { JournalCard } from "./journal-card";

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


export default function ArchiveJournal() {
  const journals = useQuery(api.journals.get) as Journal[];
  const { isLoading } = useConvexAuth()

  if (journals === undefined || isLoading) {
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
      {journals?.map(journal => (
        <JournalCard
          key={journal._id}
          title={journal.title ?? " "}
          description={journal.description ?? " "}
          creationTime={journal._creationTime}
          onClick={() => { }}
        />
      ))}
    </div>
  );
}