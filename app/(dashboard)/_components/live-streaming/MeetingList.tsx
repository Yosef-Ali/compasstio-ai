"use client"
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";


import { CardLiveMeeting } from "./card-live-meeting";
import { CardMessage } from "../chat-with-group/card-message";
import { useUser } from "@clerk/nextjs";
import { useMeeting } from "@videosdk.live/react-sdk";

interface Message {
  _creationTime: number;
  messageId: string;
}

export default function MeetingList() {
  const meetings = useQuery(api.meetings.get);

  if (meetings === undefined) {
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
          <CardLiveMeeting
            key={meeting._id}
            meetingId={meeting.meetingId ?? " "}
            creationTime={meeting._creationTime}
          />
        );
      }) : <div className="text-center pt-4">No meetings</div>}
    </div>
  );
}

