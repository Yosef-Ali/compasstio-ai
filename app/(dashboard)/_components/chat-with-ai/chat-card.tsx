import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

interface CardData {
  title: string;
  description: string;
  creationTime: number;
}

interface ChatCardProps extends CardData {
  onClick: () => void;
}

dayjs.extend(relativeTime);

export function ChatCard({ title, description, creationTime, onClick }: ChatCardProps) {

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

          {dayjs(creationTime).fromNow()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

ChatCard.Skeleton = function ChatCardSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}