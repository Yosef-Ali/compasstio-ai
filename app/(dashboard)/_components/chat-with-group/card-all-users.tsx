import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormattedTime } from "@/lib/formated-time";
import { CheckCheckIcon } from "lucide-react";

interface CardData {
  name: string;
  avatarUrl: string;
  lastSeen: number;
  status: string;
}

interface ChatCardProps extends CardData {
  onClick: () => void;
}


export function CardAllUsers({ name, lastSeen, status, avatarUrl, onClick }: ChatCardProps) {

  const formatted = useFormattedTime(lastSeen);

  return (
    <Card >
      <CardHeader>

        <div className="flex items-center">
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>

          <div className="ml-4">
            <div className="text-lg font-medium truncate">{name}</div>
            <div className="text-gray-600 truncate">Last seen &nbsp; {formatted}</div>

          </div>
        </div>


        <div className="flex-1"></div>

        <div className="flex justify-end">
          <div className="flex flex-col h-full justify-between">
            <div className="flex">
              <CheckCheckIcon className="h-5 w-5 mr-1" />
              <p className="text-sm ">{formatted}</p>
            </div>
            <div className="text-gray-600">{status}</div>
          </div>
        </div>

      </CardHeader>
    </Card>
  );
}

CardAllUsers.Skeleton = function CardMessageSkeleton() {
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