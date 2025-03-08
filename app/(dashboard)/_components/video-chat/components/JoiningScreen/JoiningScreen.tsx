"use client";
import { useState } from "react";
import { createMeeting, getToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JoiningScreenProps {
  participantName: string;
  setParticipantName: (name: string) => void;
  setMeetingId: (id: string) => void;
  setToken: (token: string) => void;
  setMicOn: (on: boolean) => void;
  setWebcamOn: (on: boolean) => void;
  micEnabled: boolean;
  webcamEnabled: boolean;
  onClickStartMeeting?: () => void;
  setIsMeetingLeft: (left: boolean) => void;
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
      import('@/app/hooks/useMeetingIdStore').then(({ useMeetingStore }) => {
        const store = useMeetingStore.getState();
        store.setToken(token);
        store.setMeetingId(meetingId);
        store.setParticipantName(participantName);
      });
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