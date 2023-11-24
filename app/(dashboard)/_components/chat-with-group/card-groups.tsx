"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { useFormatOnlyTime, useFormattedMonthYear, useFormattedTime } from "@/lib/formated-time";
import { CheckCheckIcon } from "lucide-react";
import { useOnGroupSelect } from "@/app/hooks/use-on-group-select";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface CardData {
  _id: Id<"groups">;
  _creationTime: number;
  name: string;
  avatarUrl: string;
}

export function CardGroup({ _id, name, _creationTime, avatarUrl }: CardData) {
  const formatted = useFormatOnlyTime(_creationTime);
  const formattedMonth = useFormattedMonthYear(_creationTime);

  const isActive = _id === useParams().groupId;


  const messageLast = _id && useQuery(api.groupMessages.getLastMessage, { id: _id });
  const message = messageLast && messageLast[0].message_content

  return (
    <Link href={`/chat-with-groups/${_id}`}>
      <Card className={`cursor-pointer ${isActive ? 'bg-muted' : ''}`}>
        <CardHeader>
          <div className="flex">
            <div className="flex-1">
              <div className="flex items-center">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>YA</AvatarFallback>
                </Avatar>

                <div className="ml-4 flex-shrink-0">
                  <div className="text-lg font-medium">{name}</div>
                  <div className="text-gray-600">{message}</div>
                </div>
              </div>
            </div>

            <div className="flex-1"></div>

            <div className="flex justify-end">
              <div className="flex flex-col h-full justify-between">
                <div className="flex">
                  <CheckCheckIcon className="h-5 w-5 mr-1" />
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

CardGroup.Skeleton = function CardMessageSkeleton() {
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
