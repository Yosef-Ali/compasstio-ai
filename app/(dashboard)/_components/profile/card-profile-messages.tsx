import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useFormattedTime } from "@/lib/formated-time";
import { useQuery } from "convex/react";
import { CheckCheckIcon } from "lucide-react";

interface CardProfileMessageProps {
  _id: Id<"friends">;
  friends_Id: Id<"users">
  _creationTime: number;
  isBlocked: boolean;
}



export function CardProfileMessage({ friends_Id, _creationTime, isBlocked }: CardProfileMessageProps) {

  const friendInfo = useQuery(api.users.getFriend, { id: friends_Id })
  const messageLast = useQuery(api.messages.getMessages, { receiver_id: friends_Id })


  const formatted = useFormattedTime(_creationTime);

  return (
    <Card >
      <CardHeader>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src={friendInfo?.avatarUrl} />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="text-sm font-medium leading-none">{friendInfo?.name}</p>
                <p className="text-sm text-muted-foreground truncate line-clamp-3">{messageLast && messageLast[0].content}</p>
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