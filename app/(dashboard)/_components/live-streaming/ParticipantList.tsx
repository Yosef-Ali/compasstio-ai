"use client"

import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { CardLiveStreaming } from "./card-live-streaming";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";

export default function ParticipantList() {

  const { user } = useUser();
  const meetingId = useParams().id as string


  // const getParticipantByUseParam = useQuery(api.meetings.getParticipantByUseParam, {
  //   meetingId: meetingId as string,
  // });

  // const meetingId = getMeetingByUserId?.meetingId || null;

  const getParticipantByUserId = useQuery(api.meetings.getParticipantByUserId, {
    id: user?.id as string,
  })

  const Participants = getParticipantByUserId


  return (
    <div className="grid grid-cols-1 gap-4 p-3">
      {Participants ?
        Participants.map((participant) => {
          return (
            <CardLiveStreaming
              key={participant.participantId}
              userId={participant.userId}
              meetingId={participant.participantId as string}
            />
          );
        })
        :
        <div className="text-center pt-4">No meetings</div>
      }
    </div>
  );
}