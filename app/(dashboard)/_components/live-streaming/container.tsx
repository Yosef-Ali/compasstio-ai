import { Button } from "@/components/ui/button";
import { useMeeting, Constants } from "@videosdk.live/react-sdk";
import { useEffect, useRef, useState } from "react";
import SpeakerView from "./speaker-view";
import ViewerView from "./viewer-view";
import { CodeSandboxLogoIcon } from "@radix-ui/react-icons";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ParticipantsViewer } from "./participantsView";
import { Spinner } from "@/components/spinner";

type ContainerProps = {
  meetingId: string;
  onMeetingLeave: () => void;
};

function Container(props: ContainerProps) {
  const [joined, setJoined] = useState<null | string>(null);
  const saveMeeting = useMutation(api.meetings.saveMeetingId);

  //Get the method which will be used to join the meeting.
  const { join } = useMeeting();
  const mMeeting = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      if (mMeetingRef.current.localParticipant.mode == "CONFERENCE") {
        // Choose the appropriate type based on your requirements
        const type: "SHARE_AND_CAM" | "CAM" | "SHARE" = "CAM"; // Example: Pinning only the camera
        mMeetingRef.current.localParticipant.pin(type);
      }
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
    //callback for when there is error in meeting
    onError: (error) => {
      alert(error.message);
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  const mMeetingRef = useRef(mMeeting);

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);


  //Function to save the meeting in db when the meeting is joined
  useEffect(() => {
    if (joined == "JOINED") {
      if (mMeeting.localParticipant.mode == Constants.modes.CONFERENCE) {

        //save the meeting id in db
        saveMeeting({ meetingId: props.meetingId });
      }
    }
  }, [joined])

  return (
    <div className="container w-full h-full object-contain bg-gray-800">
      {/* <h3>Meeting Id: {props.meetingId}</h3> */}
      {joined && joined == "JOINED" ? (
        mMeeting.localParticipant.mode == Constants.modes.CONFERENCE ? (
          <SpeakerView />
        ) : mMeeting.localParticipant.mode == Constants.modes.VIEWER ? (
          <ViewerView />

        ) : null
      ) : joined && joined == "JOINING" ? (
        <div className="flex justify-center items-center h-full text-gray-400">

          <Spinner size="lg" />
          <p className="ml-4">Joining the meeting...</p>

        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Button onClick={joinMeeting} className=" py-3 px-6 bg-purple-500">Join the meeting</Button>
        </div>
      )}
    </div>
  );
}

export default Container