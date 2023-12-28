import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { OperationsMenu } from "@/components/operations-menu-users";
import { useFormatOnlyTime, useFormattedTime } from "@/lib/formated-time";
import { CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatCardProps {
  _id: string;
  name: string;
  avatarUrl: string;
  _creationTime: number;
}

export function CardAllUsers({ _id, name, avatarUrl, _creationTime }: ChatCardProps) {

  const formatted = useFormatOnlyTime(_creationTime);

  return (
    <Card >
      <CardContent className="flex items-center p-4">
        <Avatar className="w-12 h-12 mr-4">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>YA</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            <div className="text-gray-600">{"Offline"}</div>
            <span>
              Last seen &nbsp;
              <Badge variant="secondary">
                {formatted}
              </Badge>
            </span>
          </CardDescription>
        </div>
        <div className="flex justify-end items-center">
          <OperationsMenu _id={_id} />
        </div>
      </CardContent>
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