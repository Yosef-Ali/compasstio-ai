"use client";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormattedTime } from "@/lib/formated-time";
import { Clock, TimerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OperationsMenu } from "@/components/oprations-menu";


interface CardData {
  _id: Id<"tasks">;
  title: string;
  description: string;
  status: string;
  dueDate: number;
  creationTime: number
}

interface ChatCardProps extends CardData {
  onClick: () => void;
}

const regex = new RegExp('"text": "([^"]*)"');

export function TaskCardDone({ _id, title, description, status, creationTime, dueDate }: ChatCardProps) {
  const formatted = useFormattedTime(creationTime);
  const isActive = _id === useParams().taskId;

  const match = description.match(regex);
  const Description = match ? match[1] : "No match found";
  const formattedDueDate = useFormattedTime(dueDate);

  return (
    <Link href={`/tasks/${_id}`} >
      <Card className={`cursor-pointer ${isActive ? 'bg-muted' : ''}`}>

        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>

            <OperationsMenu id={_id} identity={"task"} />

          </div>
          <CardDescription>{Description}</CardDescription>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-4 justify-start">

          <div className="flex flex-col  space-y-4 text-sm text-muted-foreground w-full justify-start ">
            <div className="space-y-4 xl:space-y-0 xl:flex xl:flex-row xl:gap-4" >
              {status === 'done' ? (
                <Badge className="py-1 bg-green-100 text-muted-foreground hover:bg-green-200 max-w-fit ">
                  <TimerIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                  Done
                </Badge>

              ) : (

                <Badge className="py-1 bg-blue-100 text-muted-foreground hover:bg-blue-200 max-w-fit ">
                  <TimerIcon className="mr-1 h-4 w-4 text-muted-foreground " />
                  <p className="whitespace-nowrap">
                    In progress
                  </p>
                </Badge>

              )}


              <div className="flex items-center justify-center max-w-fit ">
                <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                {formatted}
              </div>

            </div>

            <Badge className="py-1 bg-red-300 text-muted-foreground hover:bg-red-400 max-w-fit">
              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
              {formattedDueDate}
            </Badge>

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