"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { useFormatOnlyTime, useFormattedMonthYear, useFormattedTime } from "@/lib/formated-time";
import { CheckCheck, CheckCheckIcon, CheckIcon } from "lucide-react";
import { useOnGroupSelect } from "@/app/hooks/use-on-group-select";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { OperationsMenu } from "@/components/operations-menu-chat-group";
import { useUser } from "@clerk/nextjs";

interface CardFriendsProps {
  friends_Id: string
  _creationTime: number;
  isBlocked: boolean;
}

export function CardFriends({ friends_Id, _creationTime, isBlocked }: CardFriendsProps) {
  const [message, setMessage] = useState("");
  const [isRead, setIsRead] = useState(false)
  const formatted = useFormatOnlyTime(_creationTime);
  const formattedMonth = useFormattedMonthYear(_creationTime);
  const { user } = useUser()

  if (!user) {
    return <div>Loading...</div>
  }


  const friendInfo = useQuery(api.users.getFriend, { id: friends_Id })
  const messageLast = useQuery(api.messages.getMessages, { receiver_id: friends_Id })


  const isActive = friends_Id === useParams().id;

  //const isActive = true

  //const { isLoading, isAuthenticated } = useConvexAuth();

  // const messageLast = _id && useQuery(api.groupMessages.getLastMessage, { id: _id })

  //const messageLast = _id && useQuery(api.messages.getMessages, { id: _id  })

  useEffect(() => {
    if (messageLast) {
      setMessage(
        messageLast[0]?.content
      )
      setIsRead(messageLast[0]?.read)
    }
  }, [messageLast])

  return (
    <Link href={`/chat-with-groups/${friends_Id}`}>
      <Card className={`cursor-pointer ${isActive ? 'bg-muted' : ''}`}>
        <CardHeader>
          <div className="flex">
            <div className="flex-1">
              <div className="flex items-center">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={friendInfo?.avatarUrl} />
                  <AvatarFallback>YA</AvatarFallback>
                </Avatar>

                <div className="ml-4 flex-shrink-0">
                  <div className="text-lg font-medium">{friendInfo?.name}</div>
                  <div className="text-gray-600">{message}</div>
                </div>
              </div>
            </div>

            <div className="flex-1"></div>

            <div className="flex justify-end">
              <div className="flex flex-col h-full justify-between">
                <div className="flex">
                  {isRead ? <CheckCheckIcon className="h-5 w-5 mr-1" /> : <CheckIcon className="h-5 w-5 mr-1" />}
                  <p className="text-sm ">{formatted}</p>
                </div>

              </div>
            </div>
          </div>
        </CardHeader>
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
