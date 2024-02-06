import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { authToken, createMeeting } from "@/lib/api";

import Container from "./container";
import JoinScreen from "./join-screen";

import {
  MeetingProvider,
  MeetingConsumer,
} from "@videosdk.live/react-sdk";


type Mode = "CONFERENCE" | "VIEWER" | undefined;

interface User {
  id: string;
  name: string;
}

interface MeetingConfig {
  meetingId: string;
  multiStream: boolean;
  micEnabled: boolean;
  webcamEnabled: boolean;
  name: string;
  mode: Mode;
}

interface MeetingProps {
  config: MeetingConfig;
  token: string;
}

function LiveStream() {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("CONFERENCE");

  const { user } = useUser();
  const userIfo = useQuery(api.users.getUser, { id: user?.id as string });
  //const saveMeeting = useMutation(api.meetings.saveMeetingId);
  const removeMeeting = useMutation(api.meetings.removeMeeting);

  // Function to get the meeting ID and token
  const getMeetingAndToken = async (id?: string) => {
    try {
      // If no ID is provided, create a new meeting
      const newMeetingId = id == null ? await createMeeting({ token: authToken as string }) : id;
      setMeetingId(newMeetingId);
      console.log("meetingId::", newMeetingId);
      //saveMeeting({ meetingId: newMeetingId });
      console.log("authToken::", authToken);
    } catch (error) {
      console.error("Error creating or joining meeting:", error);
    }
  };

  // Function to handle leaving the meeting
  const onMeetingLeave = () => {
    setMeetingId(null);
    removeMeeting({ meetingId: meetingId as string });
  };

  // Get the meeting ID and token when the component mounts
  console.log("authToken::", authToken);

  // Render the appropriate component based on the authToken and meetingId
  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        multiStream: true,
        micEnabled: true,
        webcamEnabled: true,
        name: userIfo?.name as string,
        mode: mode,
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <Container meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <>
      <JoinScreen getMeetingAndToken={getMeetingAndToken} setMode={setMode} />
    </>
  );
}

export default LiveStream;