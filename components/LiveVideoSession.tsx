import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react"; // Added useEffect
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { useMeetingContext } from "@/app/context/MeetingContext"; // Added import

interface LiveVideoSessionProps {
  onSessionStart?: (meetingId: string) => void;
}

export function LiveVideoSession({ onSessionStart }: LiveVideoSessionProps) {
  // Local state for loading/error during the *initiation* phase
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get meeting state and actions from context
  const { meetingId, isMeetingActive, startMeeting: startMeetingInContext, endMeeting } = useMeetingContext();
  // Correct the mutation hook to use the actual function name from convex/meetings.ts
  const saveMeetingIdToDB = useMutation(api.meetings.saveMeetingId);

  // Placeholder for fetching meeting ID (remains the same)
  const fetchMeetingIdFromAPI = async (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve("meeting-" + Math.random().toString(36).substring(2, 9)),
        1000
      );
    });
  };

  // Function to initiate the meeting process
  const initiateMeeting = async () => {
    if (isMeetingActive) return; // Don't start if one is already active via context

    setIsLoading(true);
    setError(null);

    try {
      const newMeetingId = await fetchMeetingIdFromAPI();

      if (newMeetingId) {
        // Save to DB (optional, depends on your needs)
        try {
          await saveMeetingIdToDB({ meetingId: newMeetingId });
        } catch (dbError) {
          console.error("Failed to save meeting ID to DB:", dbError);
          // Decide if this is a critical error or if you can proceed
        }

        // *** Use context to start the meeting ***
        startMeetingInContext(newMeetingId);

        // Optional: Notify parent if still needed for other reasons
        if (onSessionStart) {
          onSessionStart(newMeetingId);
        }

      } else {
        setError("Failed to retrieve a meeting ID.");
      }
    } catch (err) {
      console.error("Error initiating meeting:", err);
      setError("Failed to start the meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">Shiba Link</h2>
      <p className="text-gray-300 text-center mb-4">
        Connect with your community through live video sessions
      </p>

      {error && <div className="text-red-500">{error}</div>}

      {/* Display based on context state */}
      {isMeetingActive && meetingId ? (
        <div className="w-full max-w-md text-center">
          <div className="bg-green-900/50 p-4 rounded-md mb-4">
            <p className="font-medium">Meeting is active!</p>
            <p className="text-sm text-gray-300">ID: {meetingId}</p>
            <p className="text-xs mt-2">(Meeting controls are now in the main view)</p>
          </div>
          {/* Optionally add a button to explicitly end/leave if needed here */}
          {/* <Button variant="destructive" onClick={endMeeting}>End Meeting</Button> */}
        </div>
      ) : (
        <Button
          className="bg-purple-500 hover:bg-purple-700"
          onClick={initiateMeeting} // Use the new initiation function
          disabled={isLoading || isMeetingActive} // Disable if loading or already active
        >
          {isLoading ? <Spinner size="sm" /> : "Start New Meeting"}
        </Button>
      )}
    </div>
  );
}
