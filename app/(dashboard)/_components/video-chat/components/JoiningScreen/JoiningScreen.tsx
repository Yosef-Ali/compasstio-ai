"use client";
import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import { createMeeting, getToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

// Assuming MicWebcam type is defined elsewhere or here
interface MicWebcam {
  id: string | null;
}

export interface JoiningScreenProps {
  participantName: string;
  setParticipantName: Dispatch<SetStateAction<string>>;
  setMeetingId: Dispatch<SetStateAction<string>>;
  setToken: Dispatch<SetStateAction<string>>;
  setMicOn: Dispatch<SetStateAction<boolean>>;
  setWebcamOn: Dispatch<SetStateAction<boolean>>;
  micEnabled: boolean;
  webcamEnabled: boolean;
  setSelectedMic: Dispatch<SetStateAction<MicWebcam>>;
  setSelectedWebcam: Dispatch<SetStateAction<MicWebcam>>;
  onClickStartMeeting?: () => void; // Made optional as it might not always be needed
  startMeeting?: boolean; // Made optional
  setIsMeetingLeft: Dispatch<SetStateAction<boolean>>;
}

export function JoiningScreen({
  participantName,
  setParticipantName,
  setMeetingId,
  setToken,
  setMicOn,
  setWebcamOn,
  micEnabled,
  webcamEnabled,
  setSelectedMic,
  setSelectedWebcam,
  onClickStartMeeting,
  setIsMeetingLeft,
}: JoiningScreenProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [meetingId, setMeetingIdLocal] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (meetingId && onClickStartMeeting) {
      console.log("Meeting ID received, triggering onClickStartMeeting");
      onClickStartMeeting();
    }
  }, [meetingId, onClickStartMeeting]);

  const handleStartMeeting = async () => {
    setIsLoading(true);
    setError(null);
    setMeetingIdLocal(null);

    try {
      console.log("Starting meeting creation process...");

      // 1. Get a fresh token
      const token = await getToken();
      console.log("Got token:", token);
      setToken(token);

      // 2. Create a meeting room
      const roomId = await createMeeting({ token });
      console.log("Successfully created meeting with room ID:", roomId);

      // 3. Set the meeting ID
      setMeetingIdLocal(roomId);
      setMeetingId(roomId);

      // 4. Update persistent store
      import('@/app/hooks/useMeetingIdStore').then((module) => {
        const useMeetingIdStore = module.default;
        const store = useMeetingIdStore.getState();
        store.setToken(token);
        store.setParticipantName(participantName);
      });

      setIsMeetingLeft(false);
      setIsLoading(false);

    } catch (error: any) {
      console.error("Error starting meeting:", error);
      setError(error?.message || "Failed to start meeting. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Join Meeting</h2>

        {error && (
          <div className="mb-4 space-y-2">
            <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
            <div className="text-sm text-gray-600">
              Please make sure you have a stable internet connection and try again.
              If the problem persists, contact support.
            </div>
          </div>
        )}

        <Input
          type="text"
          placeholder="Your Name"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          className="mb-4"
        />
        <Button
          onClick={handleStartMeeting}
          disabled={isLoading || !participantName}
          className="w-full"
        >
          {isLoading ? "Creating meeting..." : "Start Meeting"}
        </Button>
      </div>
    </div>
  );
}