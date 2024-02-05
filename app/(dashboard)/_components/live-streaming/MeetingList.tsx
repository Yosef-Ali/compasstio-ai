"use client"
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";


import { CardLiveMeeting } from "./card-live-meeting";

interface Message {
  _creationTime: number;
  messageId: string;
}

export default function MeetingList() {
  const meetings = useQuery(api.meetings.get);

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {meetings ? meetings.map((meeting) => {
        return (
          <CardLiveMeeting
            key={meeting._id}
            meetingId={meeting.meetingId ?? " "}
            creationTime={meeting._creationTime}
          />
        );
      })
        :
        <div className="text-center pt-4">No meetings</div>
      }
    </div>
  );
}

