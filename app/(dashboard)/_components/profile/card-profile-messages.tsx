import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { useFormattedTime } from "@/lib/formated-time";
import { CheckCheckIcon } from "lucide-react";

interface CardProfileMessageProps {
  name: string;
  content: string;
  creationTime: number;
  avatarUrl: string;
}



export function CardProfileMessage({ name, content, creationTime, avatarUrl }: CardProfileMessageProps) {

  const formatted = useFormattedTime(creationTime);

  return (
    <Card >
      <CardHeader>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-sm text-muted-foreground truncate line-clamp-3">{content}</p>
              </div>
            </div>
          </div>

          <div className="flex-1"></div>

          <div className="flex justify-end">
            <div className="flex flex-col h-full justify-between">
              <p className="text-sm ">{formatted}</p>
              {/* <CheckCheckIcon className="h-5 w-5" /> */}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

CardProfileMessage.Skeleton = function CardProfileMessageSkeleton() {
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