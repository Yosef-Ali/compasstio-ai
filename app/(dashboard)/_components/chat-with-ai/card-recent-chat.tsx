"use client"
import { OperationsMenu } from "@/components/oprations-menu";
import OperationsMenuChat from "@/components/oprations-menu-chat-ai";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PinIcon } from "lucide-react";
import { useState } from "react";

interface ChatCardProps {
  id: Id<"chats">;
  prompt: string;
  result: string;
  creationTime: number;
}


dayjs.extend(relativeTime);

export function CardRecentChat({ id, prompt, result, creationTime }: ChatCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card onClick={handleClick} >
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg ">
            {prompt}
          </CardTitle>
          <OperationsMenuChat id={id} isPinned="recent" />
        </div>
        <CardDescription className={`text-gray-700 flex-1 ${expanded ? '' : 'line-clamp-2'
          } transition-all duration-300`}>{result}</CardDescription>
        <CardDescription>
          {dayjs(creationTime).fromNow()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

CardRecentChat.Skeleton = function ChatCardSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}