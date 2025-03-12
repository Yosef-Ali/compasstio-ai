"use client";
import { useState } from "react";

interface UseRaisedHandParticipantsReturn {
  participantRaisedHand: (participantId: string) => void;
  raisedHandsParticipants: string[];
}

export default function useRaisedHandParticipants(): UseRaisedHandParticipantsReturn {
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<string[]>([]);

  const participantRaisedHand = (participantId: string) => {
    setRaisedHandsParticipants((participants) => {
      if (!participants.includes(participantId)) {
        return [...participants, participantId];
      }
      return participants;
    });

    setTimeout(() => {
      setRaisedHandsParticipants((participants) => {
        const newRaisedHandsParticipants = participants.filter(
          (id) => id !== participantId
        );
        return newRaisedHandsParticipants;
      });
    }, 3000);
  };

  return { participantRaisedHand, raisedHandsParticipants };
}
