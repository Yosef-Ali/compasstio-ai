"use client"
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PinIcon } from "lucide-react";

interface ChatCardProps {
  id: string;
  prompt: string;
  result: string;
  creationTime: number;
}


dayjs.extend(relativeTime);

export function CardRecentChat({ id, prompt, result, creationTime }: ChatCardProps) {

  const Pinned = useMutation(api.chats.pinned);

  const handleClick = () => {
    Pinned({
      id: id as Id<"chats">,
    });
  }

  return (
    <Card  >
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg truncate md:max-w-[100px] xl:max-w-full">
            {prompt}
          </CardTitle>
          <Button variant="outline" size="icon" onClick={handleClick}>
            <PinIcon className="w-4 h-4 text-foreground" />
          </Button>
        </div>
        <CardDescription className="line-clamp-2 flex-1 min ">{result}</CardDescription>
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