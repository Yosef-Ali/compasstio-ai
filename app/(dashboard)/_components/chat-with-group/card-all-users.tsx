import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { OperationsMenu } from "@/components/operations-menu-users";
import { useFormatOnlyTime, useFormattedTime } from "@/lib/formated-time";

interface ChatCardProps {
  _id: string;
  name: string;
  avatarUrl: string;
  _creationTime: number;
}

export function CardAllUsers({ _id, name, avatarUrl, _creationTime }: ChatCardProps) {

  const formatted = useFormatOnlyTime(_creationTime);

  return (
    <Card  >
      <CardHeader className="p-4 lg:p4">
        <div className="flex items-center justify-between">
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <div className="text-lg font-medium truncate">{name}</div>
            <div className="flex flex-col xl:flex xl:flex-row ">
              <div className="text-gray-600">{"Offline"}</div>
              <p className="text-gray-600 truncate">Last seen &nbsp; {formatted}</p>
            </div>

          </div>
          <div className="flex-1"></div>
          <div className="flex justify-end">
            <div className="flex flex-col h-full justify-between">
              <div className="flex">
                <OperationsMenu _id={_id} />
              </div>
            </div>
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