"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useFormattedTime } from "@/lib/formated-time";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { CheckCheckIcon } from "lucide-react";
import Link from "next/link";


interface ChatCardProps {
  meetingId: string;
  creationTime: number;
}


export function CardLiveMeeting({ meetingId, creationTime }: ChatCardProps) {
  const user = useUser();
  const meeting = useQuery(api.meetings.getMeeting, { id: meetingId });
  const userIfo = useQuery(api.users.getUser, { id: meeting?.userId as string });

  const formatted = useFormattedTime(creationTime);
  const Moderator = meeting?.userId === user?.user?.id
  return (
    <Link href={`/live-sessions/${Moderator ? null : meetingId}`}>
      <Card className={Moderator ? "cursor-not-allowed bg-muted" : " cursor-pointer "} >
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
                  <div className="text-gray-600">{meeting?.meetingId}</div>
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
    </Link>
  );
}

CardLiveMeeting.Skeleton = function CardMessageSkeleton() {
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