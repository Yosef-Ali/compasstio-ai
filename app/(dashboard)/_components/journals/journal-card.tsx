"use client"
import React, { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormattedTime } from "@/lib/formated-time";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useParams } from "next/navigation";
import "@blocknote/core/style.css";




interface CardData {
  _id: Id<"journals">;
  title: string;
  description: any;
  creationTime: number;
}

const regex = new RegExp('"text": "([^"]*)"');

export function JournalCard({ _id, title, description, creationTime }: CardData) {

  const isActive = _id === useParams().journalId;

  //const regex = /regex-pattern/;
  const match = description.match(regex);
  const Description = match ? match[1] : "No match found";


  console.log('description', description[0]?.content?.[0]?.text);

  const formatted = useFormattedTime(creationTime);

  return (
    <Link href={`/journals/${_id}`} >
      <Card className={`cursor-pointer ${isActive ? 'bg-muted' : ''}`}>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg truncate">{title}</CardTitle>
            <button className="text-gray-500" onClick={() => { }}>
              {/* button code */}
            </button>
          </div>
          <CardDescription className="line-clamp-2">{Description}</CardDescription>
          <CardDescription>
            {formatted}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

JournalCard.Skeleton = function ChatCardSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}