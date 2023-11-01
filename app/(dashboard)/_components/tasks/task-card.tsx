import InprogressBag from "@/components/inprogress-icon";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormattedTime } from "@/lib/formated-time";
import { Clock, TimerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge"


interface CardData {
  title: string;
  description: string;
  creationTime: number;
}

interface ChatCardProps extends CardData {
  onClick: () => void;
}

export function TaskCard({ title, description, creationTime, onClick }: ChatCardProps) {
  const formatted = useFormattedTime(creationTime);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <button className="text-gray-500" onClick={onClick}>
            {/* button code */}
          </button>
        </div>
        <CardDescription>{description}</CardDescription>
        <CardDescription>


        </CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="flex space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Badge className="py-1 bg-blue-100 text-muted-foreground hover:bg-blue-200">
              <TimerIcon className="mr-1 h-4 w-4 text-muted-foreground" />
              In progress
            </Badge>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
            {formatted}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

TaskCard.Skeleton = function ChatCardSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}