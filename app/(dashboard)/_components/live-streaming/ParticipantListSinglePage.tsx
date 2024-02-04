"use client"

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { CardLiveStreaming } from "./card-live-streaming";
import { CardMessage } from "../chat-with-group/card-message";
import { useParams } from "next/navigation";


export default function ParticipantList() {

  const meetingId = useParams().id as string

  const getParticipantByUseParam = useQuery(api.meetings.getParticipantByUseParam, {
    meetingId: meetingId as string,
  });

  const Participants = getParticipantByUseParam

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