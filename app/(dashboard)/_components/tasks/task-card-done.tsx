"use client";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormattedTime } from "@/lib/formated-time";
import { Clock, TimerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useParams } from "next/navigation";


interface CardData {
  _id: Id<"tasks">;
  title: string;
  description: string;
  creationTime: number;
}

interface ChatCardProps extends CardData {
  onClick: () => void;
}

const regex = new RegExp('"text": "([^"]*)"');

export function TaskCardDone({ _id, title, description, creationTime, onClick }: ChatCardProps) {
  const formatted = useFormattedTime(creationTime);
  const isActive = _id === useParams().taskId;

  const match = description.match(regex);
  const Description = match ? match[1] : "No match found";

  return (
    <Link href={`/tasks/${_id}`} >
      <Card className={`cursor-pointer ${isActive ? 'bg-muted' : ''}`}>

        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <button className="text-gray-500" onClick={onClick}>
              {/* button code */}
            </button>
          </div>
          <CardDescription>{Description}</CardDescription>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Badge className="py-1 bg-green-100 text-muted-foreground hover:bg-green-200">
                <TimerIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                Done
              </Badge>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
              {formatted}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

TaskCardDone.Skeleton = function ChatCardSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}