"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useFormattedTime } from "@/lib/formated-time";
import { useQuery } from "convex/react";
import { CheckCheckIcon } from "lucide-react";
import Link from "next/link";


interface LiveStreamingProps {
  userId: string;
  meetingId: string;
}


export function CardLiveStreaming({ userId, meetingId }: LiveStreamingProps) {

  const userIfo = useQuery(api.users.getUser, { id: userId as string });

  const formatted = useFormattedTime(userIfo?._creationTime as number);
  
  return (
    <Card className="cursor-pointer" >
      <CardHeader>
        <div className="flex">
          <div className="flex-1">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src={userIfo?.avatarUrl} />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>

              <div className="ml-4">
                <div className="text-lg font-medium">{userIfo?.name}</div>
                {/* <div className="text-gray-600">{meetingId}</div> */}
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

CardLiveStreaming.Skeleton = function CardMessageSkeleton() {
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