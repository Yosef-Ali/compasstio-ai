import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

interface LiveVideoSessionProps {
  onSessionStart?: (meetingId: string) => void;
}

export function LiveVideoSession({ onSessionStart }: LiveVideoSessionProps) {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveMeetingId = useMutation(api.meetings.save); // Assuming this mutation exists

  const fetchMeetingIdFromAPI = async (): Promise<string> => {
    // This is a placeholder for your actual API call
    // Replace with your actual implementation
    return new Promise((resolve) => {
      setTimeout(
        () => resolve("meeting-" + Math.random().toString(36).substring(2, 9)),
        1000
      );
    });
  };

  const startMeeting = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get meeting ID from external API
      const newMeetingId = await fetchMeetingIdFromAPI();

      if (newMeetingId) {
        setMeetingId(newMeetingId);
        await saveMeetingId({ meetingId: newMeetingId });

        // Notify parent component if callback provided
        if (onSessionStart) {
          onSessionStart(newMeetingId);
        }
      }
    } catch (err) {
      console.error("Error starting meeting:", err);
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

      {meetingId ? (
        <div className="w-full max-w-md">
          <div className="bg-purple-900/30 p-4 rounded-md mb-4">
            <p className="font-medium">Your meeting is active!</p>
            <p className="text-sm text-gray-300">Meeting ID: {meetingId}</p>
          </div>
          <Button
            className="w-full bg-purple-500 hover:bg-purple-700"
            onClick={() => window.open(`/meeting/${meetingId}`, "_blank")}
          >
            Join Meeting
          </Button>
        </div>
      ) : (
        <Button
          className="bg-purple-500 hover:bg-purple-700"
          onClick={startMeeting}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Start New Meeting"}
        </Button>
      )}
    </div>
  );
}
