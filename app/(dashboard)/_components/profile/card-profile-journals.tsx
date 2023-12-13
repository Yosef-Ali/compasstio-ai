"use client"
import React, { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormattedTime } from "@/lib/formated-time";
import "@blocknote/core/style.css";
import { Console } from "console";

interface CardData {
  title: string;
  description: any;
  creationTime: number;
}

const regex = new RegExp('"text": "([^"]*)"');

export function JournalCard({ title, description, creationTime }: CardData) {


  console.log(description);



  //const regex = /regex-pattern/;
  const match = description.match(regex);
  const Description = match ? match[1] : "No match found";


  const formatted = useFormattedTime(creationTime);

  return (
    <Card className="">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2">{Description}</CardDescription>
        <CardDescription>
          {formatted}
        </CardDescription>
      </CardHeader>
    </Card>

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