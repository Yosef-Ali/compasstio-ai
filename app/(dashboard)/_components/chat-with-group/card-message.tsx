import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormattedTime } from "@/lib/formated-time";
import { CheckCheckIcon } from "lucide-react";

interface CardData {
  name: string;
  content: string;
  creationTime: number;
  avatarUrl: string;
}

interface ChatCardProps extends CardData {
  onClick: () => void;
}


export function CardMessage({ name, content, creationTime, avatarUrl, onClick }: ChatCardProps) {

  const formatted = useFormattedTime(creationTime);

  return (
    <Card >
      <CardHeader>
        <div className="flex">
          <div className="flex-1">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>

              <div className="ml-4">
                <div className="text-lg font-medium">{name}</div>
                <div className="text-gray-600">{formatted}</div>
              </div>
            </div>
          </div>

          <div className="flex-1"></div>

          <div className="flex justify-end">
            <div className="flex flex-col h-full justify-between">
              <p className="text-sm ">{formatted}</p>
              <CheckCheckIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

CardMessage.Skeleton = function CardMessageSkeleton() {
  return (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  )
}