"use client"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormattedTime } from "@/lib/formated-time";
import { Clock, TimerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";


interface CardData {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: string;
  dueDate: number;
  creationTime: number;
}

interface ChatCardProps extends CardData {
  onClick: () => void;
}

const regex = new RegExp('"text": "([^"]*)"');

export function TaskCardInProgress({ _id, title, description, status, creationTime, dueDate, onClick }: ChatCardProps) {

  const isActive = _id === useParams().taskId;

  const match = description.match(regex);
  const Description = match ? match[1] : "No match found";

  const formatted = useFormattedTime(creationTime);
  const formattedDueDate = useFormattedTime(dueDate);

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
          <CardDescription className="line-clamp-2">{Description}</CardDescription>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-4 text-sm text-muted-foreground w-full ">
            <div className="flex items-center">
              {status === 'in progress' ? (
                <Badge className="py-1 bg-blue-100 text-muted-foreground hover:bg-blue-200">
                  <TimerIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                  In progress
                </Badge>
              ) : (
                <Badge className="py-1 bg-green-100 text-muted-foreground hover:bg-green-200">
                  <TimerIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                  Done
                </Badge>
              )}
            </div>

            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
              {formatted}
            </div>
          </div>

          <Badge className="py-1 bg-red-300 text-muted-foreground hover:bg-red-400 flex-shrink-0">
            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
            {formattedDueDate}
          </Badge>

        </CardFooter>
      </Card>
    </Link>
  );
}

TaskCardInProgress.Skeleton = function ChatCardSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}