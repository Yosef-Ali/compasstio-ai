import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormattedTime } from "@/lib/formated-time";

interface CardData {
  title: string;
  description: string;
  creationTime: number;
}

interface ChatCardProps extends CardData {
  onClick: () => void;
}

export function JournalCard({ title, description, creationTime, onClick }: ChatCardProps) {
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