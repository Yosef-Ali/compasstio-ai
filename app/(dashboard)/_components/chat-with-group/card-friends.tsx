"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { useFormatOnlyTime, useFormattedMonthYear, useFormattedTime } from "@/lib/formated-time";
import { CheckCheck, CheckCheckIcon, CheckIcon } from "lucide-react";
import { useOnGroupSelect } from "@/app/hooks/use-on-group-select";
import Link from "next/link";
import { useParams } from "next/navigation";
import {  useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { OperationsMenu } from "@/components/operations-menu-chat-group";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import useActiveFriendStore from "@/app/hooks/useActiveFriend";

interface CardFriendsProps {
  friends_Id: string
  _creationTime: number;
  message: string;
  isRead: boolean;
}

export function CardFriends({ friends_Id, _creationTime, message, isRead }: CardFriendsProps) {

  const formatted = useFormatOnlyTime(_creationTime);
  const formattedMonth = useFormattedMonthYear(_creationTime);
  const { activeFriendId, setActiveFriendId } = useActiveFriendStore();

  const { user } = useUser()

  if (!user) {
    return <div>Loading...</div>
  }

 

  const friendInfo = useQuery(api.users.getFriend, { id: friends_Id })
  
  const isActive = friends_Id === useParams().id;

  // Set the active friend ID
  if (isActive && friends_Id !== activeFriendId) {
    setActiveFriendId(friends_Id);

  }

  return (
    <Link href={`/messaging/${friends_Id}`}>

      <Card className={`cursor-pointer z-0  ${isActive ? 'bg-muted' : ''}`}>
        <CardContent className="flex items-center p-4">
          <Avatar className="w-12 h-12 mr-4">
            <AvatarImage src={friendInfo?.avatarUrl} />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-lg font-semibold">{friendInfo?.name}</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              {message}
            </CardDescription>
          </div>
          <div className="flex flex-col h-full justify-between items-end">

            {isRead ? <CheckCheckIcon className="h-5 w-5 mr-1" /> : <CheckIcon className="h-5 w-5 mr-1" />}

            <Badge className="mt-2" variant="secondary">
              {formatted}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

CardFriends.Skeleton = function CardMessageSkeleton() {
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
