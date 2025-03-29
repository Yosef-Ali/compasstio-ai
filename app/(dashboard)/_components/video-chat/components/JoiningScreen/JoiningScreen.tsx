"use client";
import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
// Import validateMeeting as well
import { createMeeting, getToken, validateMeeting } from "@/lib/api";
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
  const [isLoadingCreate, setIsLoadingCreate] = React.useState(false);
  const [isLoadingJoin, setIsLoadingJoin] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [joinMeetingId, setJoinMeetingId] = React.useState<string>(""); // State for join input
  const router = useRouter();

  // No need for useEffect based on local meetingId state anymore

  const handleCreateMeeting = async () => {
    setIsLoadingCreate(true);
    setError(null);

    try {
      console.log("Starting meeting creation process...");
      // 1. Get a token with create permissions (no roomId)
      const token = await getToken();
      setToken(token);

      // 2. Create a meeting room using the token
      const roomId = await createMeeting({ token });
      console.log("Successfully created meeting with room ID:", roomId);
      setMeetingId(roomId); // Set the main meetingId state

      // 3. Trigger meeting start
      if (onClickStartMeeting) {
        onClickStartMeeting();
      }
      setIsMeetingLeft(false);

    } catch (error: any) {
      console.error("Error creating meeting:", error);
      setError(error?.message || "Failed to create meeting. Please try again.");
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleJoinMeeting = async () => {
    setIsLoadingJoin(true);
    setError(null);

    if (!joinMeetingId.trim()) {
      setError("Please enter a Meeting ID to join.");
      setIsLoadingJoin(false);
      return;
    }

    try {
      console.log(`Attempting to join meeting: ${joinMeetingId}`);
      // 1. Get a token specifically for joining this room
      const token = await getToken(joinMeetingId);
      setToken(token);

      // 2. Set the meeting ID (Validation removed - SDK handles join auth)
      console.log("Setting meeting ID for join:", joinMeetingId);
      setMeetingId(joinMeetingId); // Set the main meetingId state

      // 3. Trigger meeting start
      if (onClickStartMeeting) {
        onClickStartMeeting();
      }
      setIsMeetingLeft(false);

    } catch (error: any) {
      console.error("Error joining meeting:", error);
      setError(error?.message || "Failed to join meeting. Please try again.");
    } finally {
      setIsLoadingJoin(false);
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

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Your Name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            className="mb-2" // Reduced margin
          />
          <Button
            onClick={handleCreateMeeting}
            disabled={isLoadingCreate || isLoadingJoin || !participantName}
            className="w-full"
          >
            {isLoadingCreate ? "Creating..." : "Create New Meeting"}
          </Button>

          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Input
            type="text"
            placeholder="Enter Meeting ID to Join"
            value={joinMeetingId}
            onChange={(e) => setJoinMeetingId(e.target.value)}
            className="mb-2" // Reduced margin
          />
          <Button
            onClick={handleJoinMeeting}
            disabled={isLoadingJoin || isLoadingCreate || !participantName || !joinMeetingId}
            className="w-full"
            variant="outline" // Use outline style for join button
          >
            {isLoadingJoin ? "Joining..." : "Join Existing Meeting"}
          </Button>
        </div>
      </div>
    </div>
  );
}
