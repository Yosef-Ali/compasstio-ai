"use client"
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";


import { CardLiveStreaming } from "./card-live-streaming";
import { CardMessage } from "../chat-with-group/card-message";
import { useUser } from "@clerk/nextjs";
import { useMeeting } from "@videosdk.live/react-sdk";

interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  content?: string;
  senderId?: string;
  avatarUrl?: string;
  messageId: string;
  chatId: string;
  isRead: boolean;
}

export default function ParticipantList() {
  const { user } = useUser();
  const userIfo = useQuery(api.users.getUser, { id: user?.id as string });
  const meetings = useQuery(api.meetings.get);

  const messages = [] as Message[];

  if (messages === undefined) {
    return (
      <div className="space-y-3">
        <CardMessage.Skeleton />
        <CardMessage.Skeleton />
        <CardMessage.Skeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {meetings ? meetings?.map(meeting => {
        return (
          <CardLiveStreaming
            key={meeting._id}
            name={userIfo?.name ?? " "}
            meetingId={meeting.meetingId ?? " "}
            creationTime={meeting._creationTime}
            avatarUrl={userIfo?.avatarUrl ?? " "}
          />
        );
      }) : <div className="text-center pt-4">No meetings</div>}
    </div>
  );
}

