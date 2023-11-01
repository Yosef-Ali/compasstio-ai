"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { ChatCard } from "../chat-with-ai/chat-card";
import { Id, Doc } from "@/convex/_generated/dataModel";

import { TaskCard } from "./task-card";
import { TaskCardDone } from "./task-card-done";

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


export default function CurrentTasks() {
  const journals = useQuery(api.journals.get) as Journal[];

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
      {journals?.map(journal => (
        <TaskCardDone
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