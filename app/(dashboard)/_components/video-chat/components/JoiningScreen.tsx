"use client";

import React, { useState } from 'react';
import { requestMediaPermissions, getMediaErrorMessage } from '@/lib/media-utils';
import { createMeeting, getToken, validateMeeting } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useMeetingIdStore from '@/app/hooks/useMeetingIdStore';

interface JoiningScreenProps {
  participantName: string;
  setParticipantName: (name: string) => void;
  setMeetingId: (id: string) => void;
  setToken: (token: string) => void;
  setMicOn: (on: boolean) => void;
  setWebcamOn: (on: boolean) => void;
  micEnabled: boolean;
  webcamEnabled: boolean;
  onClickStartMeeting: () => void;
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

      // First check media permissions
      await requestMediaPermissions();

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

      // Store in persistent store
      useMeetingIdStore.getState().setMeetingId(meetingId);
      useMeetingIdStore.getState().setToken(token);

      onClickStartMeeting();
    } catch (error: unknown) {
      const errorMessage = getMediaErrorMessage(error);
      setError(errorMessage);
      console.error('Start meeting error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinMeeting = async (meetingId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // First check media permissions
      await requestMediaPermissions();

      // Get a fresh token
      const token = await getToken();
      
      // Validate the meeting ID
      const isValid = await validateMeeting({ roomId: meetingId, token });
      if (!isValid) {
        throw new Error("Invalid meeting ID");
      }
      
      // Update state
      setToken(token);
      setMeetingId(meetingId);
      setIsMeetingLeft(false);

      // Store in persistent store
      useMeetingIdStore.getState().setMeetingId(meetingId);
      useMeetingIdStore.getState().setToken(token);

    } catch (error: unknown) {
      const errorMessage = getMediaErrorMessage(error);
      setError(errorMessage);
      console.error('Join meeting error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={() => setMicOn(!micEnabled)}
              variant={micEnabled ? "default" : "outline"}
              className="flex-1"
            >
              {micEnabled ? "Mic On" : "Mic Off"}
            </Button>
            <Button
              onClick={() => setWebcamOn(!webcamEnabled)}
              variant={webcamEnabled ? "default" : "outline"}
              className="flex-1"
            >
              {webcamEnabled ? "Camera On" : "Camera Off"}
            </Button>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleStartMeeting}
              className="w-full"
              disabled={isLoading || !participantName}
            >
              {isLoading ? "Creating Meeting..." : "Create New Meeting"}
            </Button>

            <Button
              onClick={() => {
                const meetingIdInput = prompt("Enter meeting ID");
                if (meetingIdInput) {
                  handleJoinMeeting(meetingIdInput);
                }
              }}
              variant="outline"
              className="w-full"
              disabled={isLoading || !participantName}
            >
              Join Existing Meeting
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
