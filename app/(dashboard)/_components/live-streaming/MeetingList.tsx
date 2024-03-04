"use client"
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";


import { CardLiveMeeting } from "./card-live-meeting";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import useMeetingIdStore from "@/app/hooks/useMeetingIdStore";
import useGroupSelected from "@/app/hooks/useGroupSelected";
import { useUser } from "@clerk/nextjs";

interface Message {
  _creationTime: number;
  messageId: string;
}



export default function MeetingList() {
  
  const meetingIdStore = useMeetingIdStore()
  const { currentMeetingId } = meetingIdStore;
  const { items } = useGroupSelected()

  const meetingsList = useQuery(api.meetings.getMeetings);

  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {meetingsList ? meetingsList.map((meeting) => {
        return (
          <CardLiveMeeting
            key={meeting._id}
            meetingId={meeting.meetingId}
            userId={meeting.userId}
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

