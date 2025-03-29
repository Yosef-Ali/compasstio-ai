"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { createMeeting, getToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartMeeting = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting meeting creation process...");

      // Get a fresh token from our server-side API
      const token = await getToken();
      console.log("Got token:", token);

      // Create meeting with the token
      const meetingId = await createMeeting({ token });
      console.log("Successfully created meeting with ID:", meetingId);

      if (!meetingId) {
        throw new Error("No meeting ID returned");
      }

      // Set local state
      setToken(token);
      setMeetingId(meetingId);
      setIsMeetingLeft(false);

      // Also store in persistent store
      import('@/app/hooks/useMeetingIdStore').then((module) => {
        const useMeetingIdStore = module.default;
        const store = useMeetingIdStore.getState();
        store.setToken(token);
        store.setMeetingId(meetingId);
        store.setParticipantName(participantName);
      });

      // Call the callback to signal meeting start
      if (onClickStartMeeting) {
        onClickStartMeeting();
      }

    } catch (error: any) {
      console.error("Error starting meeting:", error);
      setError(error?.message || "Failed to start meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Join Meeting</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
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
          {isLoading ? "Starting..." : "Start Meeting"}
        </Button>
      </div>
    </div>
  );
}