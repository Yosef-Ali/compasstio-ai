"use client";

import useMeetingIdStore from "@/app/hooks/useMeetingIdStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useFormattedTime } from "@/lib/formated-time";
import { useQuery } from "convex/react";
import { CheckCheckIcon } from "lucide-react";
import MeetingIdCopyBTN from "./meetingId-copy-BTN";


interface ChatCardProps {
  meetingId: string;
  userId: string;
  creationTime: number;
}

interface User {
  _id: Id<"users">;
  _creationTime: number;
  email?: string;
  userId?: string;
  name: string;
  avatarUrl: string;
  bio: string;
  username: string;
  tokenIdentifier: string;
  endsOn?: number;
  subscriptionId?: string;
  // Add any other properties here
}

interface FullUser {
  _id: Id<"users">;
  _creationTime: number;
  email?: string;
  userId?: string;
  name: string;
  avatarUrl?: string;
  bio: string;
  username: string;
  tokenIdentifier?: string;
  endsOn?: number;
  subscriptionId?: string;
  // Add any other additional properties here
}

const CardSingle: React.FC<{
  userIfo: FullUser | null | undefined;
  meetingId: string;
  creationTime: number;
  currentMeetingId?: string | undefined;
}> = ({ userIfo, meetingId, creationTime, currentMeetingId }) => {
  const formatted = useFormattedTime(creationTime);

  return (
    <Card>
      <CardHeader>
        <div className="flex">
          <div className="flex-1">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src={userIfo?.avatarUrl} />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <div className="text-lg font-medium">{userIfo?.username}</div>
                <MeetingIdCopyBTN meetingId={meetingId as string} />
                <p className="text-sm text-muted-foreground truncate ">
                  Copy Meeting Code.
                </p>
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
};

export function CardLiveMeeting({ meetingId, userId, creationTime, }: ChatCardProps) {
  const meetingIdStore = useMeetingIdStore()
  const { currentMeetingId } = meetingIdStore;
  const userIfo = useQuery(api.users.getUser, { id: userId as string }) as FullUser | null | undefined;



  return meetingId ? (

    <CardSingle userIfo={userIfo} meetingId={meetingId} creationTime={creationTime} currentMeetingId={currentMeetingId as string} />

  ) :
    <> No meeting created</>
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