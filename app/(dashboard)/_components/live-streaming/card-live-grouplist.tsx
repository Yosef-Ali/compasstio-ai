"use client";

import { useEffect } from "react";
import useGroupSelected from "@/app/hooks/useGroupSelected";
import useMeetingIdStore from "@/app/hooks/useMeetingIdStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useFormattedTime } from "@/lib/formated-time";
import { useMutation, useQuery } from "convex/react";


interface LiveStreamingProps {
  userId: string;
  title: string;
  members: string[];
  groupId: string;
}

const Avatars = ({ email }: { email: string }) => {
  const member = useQuery(
    api.users.getAllUsersByEmail,
    { email: email }
  );

  return (
    <div className="flex -space-x-4">
      <Avatar >
        <AvatarImage src={member?.avatarUrl} />
        <AvatarFallback>YA</AvatarFallback>
      </Avatar>
    </div>
  );
};


export function CardGroupList({ userId, title, members, groupId }: LiveStreamingProps) {
  const saveGroupsInMeeting = useMutation(api.meetings.saveGroupsInMeeting)
  const removeGroupsInMeeting = useMutation(api.meetings.removeGroupsInMeeting);
  const meetingIdStore = useMeetingIdStore();
  const { currentMeetingId } = meetingIdStore;
  const userIfo = useQuery(api.users.getUser, { id: userId as string });
  const formatted = useFormattedTime(userIfo?._creationTime ?? 0); // use nullish coalescing operator
  const { items, toggleItem, deleteItem } = useGroupSelected();

  useEffect(() => {
    if (!currentMeetingId) {
      deleteItem(groupId);
    }
  }, [currentMeetingId]);

  const handleSwitch = (value: boolean,) => {
    toggleItem(groupId);
    console.log("handleSwitch", value);
    if (value && currentMeetingId) {
      saveGroupsInMeeting({
        meetingId: currentMeetingId as string,
        groupId: groupId as Id<"groups">,
      })
    }

    if (value === false && groupId && currentMeetingId) {
      removeGroupsInMeeting({
        meetingId: currentMeetingId as string,
        groupId: groupId as Id<"groups">,
      })
    }
  }

  return (
    <Card className="cursor-pointer" >
      <CardHeader>
        <div className="flex">
          <div className="flex-1">
            <div className="">
              <div className="flex  -space-x-2">
                {members.map((member) => (
                  <Avatars key={member} email={member} />
                ))}
              </div>
              <div className="whitespace-nowrap p-1">{title}</div>
            </div>
          </div>

          <div className="flex-1"></div>

          <div className="flex justify-end">
            <div className="flex flex-col h-full justify-between">
              <p className="text-sm">{formatted}</p>
              <div className="flex justify-end w-full">
                <Switch className="bg-muted"
                  id="airplane-mode"
                  disabled={!currentMeetingId}
                  checked={currentMeetingId ? items.includes(groupId) : false} // use items.includes expression
                  onCheckedChange={(checked: boolean) => handleSwitch(checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}


CardGroupList.Skeleton = function CardMessageSkeleton() {
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