import React, { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { JoiningScreen } from "../components/JoiningScreen";
import { MeetingContainer, MeetingContainerProps } from "../components/MeetingContainer/MeetingContainer";
import { SnackbarProvider } from "notistack";
import { LeaveScreen } from "../components/LeaveScreen";
import { ThemeProvider, useMediaQuery, useTheme } from "@material-ui/core";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useMeetingContext } from "@/app/context/MeetingContext"; // Import our context
import generateMuiTheme from "@/mui/theme";

interface MicWebcam {
  id: string | null;
}

interface MeetingAppContainerProps {
  controlsVisible?: boolean;
}

function MeetingAppContainer({ controlsVisible: parentControlsVisible }: MeetingAppContainerProps) {
  // Get the global meeting state from our context
  const { meetingId: contextMeetingId, isMeetingActive } = useMeetingContext();

  // Local states for the component
  const [token, setToken] = useState<string>("");
  // Use the context meeting ID if available
  const [meetingId, setMeetingId] = useState<string>(contextMeetingId || "");
  const [participantName, setParticipantName] = useState<string>("");
  const [micOn, setMicOn] = useState<boolean>(true);
  const [webcamOn, setWebcamOn] = useState<boolean>(true);
  const [selectedMic, setSelectedMic] = useState<MicWebcam>({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState<MicWebcam>({ id: null });
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState<string | null>(
    selectedWebcam.id
  );
  const [selectMicDeviceId, setSelectMicDeviceId] = useState<string | null>(selectedMic.id);
  // Set meeting started based on context if a meeting is active
  const [isMeetingStarted, setMeetingStarted] = useState<boolean>(isMeetingActive || false);
  const [isMeetingLeft, setIsMeetingLeft] = useState<boolean>(false);
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<
    { participantId: string; raisedHandOn: number }[]
  >([]);
  // Use the parent's controlsVisible prop or default to false
  const [controlsVisible, setControlsVisible] = useState<boolean>(parentControlsVisible || false);


  const useRaisedHandParticipants = () => {
    const raisedHandsParticipantsRef = useRef<
      { participantId: string; raisedHandOn: number }[]
    >([]);

    const participantRaisedHand = (participantId: string) => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const newItem = { participantId, raisedHandOn: new Date().getTime() };

      const participantFound = raisedHandsParticipants.findIndex(
        ({ participantId: pID }) => pID === participantId
      );

      if (participantFound === -1) {
        raisedHandsParticipants.push(newItem);
      } else {
        raisedHandsParticipants[participantFound] = newItem;
      }

      setRaisedHandsParticipants(raisedHandsParticipants);
    };

    useEffect(() => {
      raisedHandsParticipantsRef.current = raisedHandsParticipants;
    }, [raisedHandsParticipants]);

    const _handleRemoveOld = () => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const now = new Date().getTime();

      const persisted = raisedHandsParticipants.filter(({ raisedHandOn }) => {
        return parseInt(raisedHandOn.toString()) + 15000 > parseInt(now.toString());
      });

      if (raisedHandsParticipants.length !== persisted.length) {
        setRaisedHandsParticipants(persisted);
      }
    };

    useEffect(() => {
      const interval = setInterval(_handleRemoveOld, 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return { participantRaisedHand };
  };

  const theme = useTheme();
  const isXStoSM = useMediaQuery(theme.breakpoints.only("xs"));

  useEffect(() => {
    if (isXStoSM) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isXStoSM]);

  // Sync local state with context
  useEffect(() => {
    if (contextMeetingId) {
      setMeetingId(contextMeetingId);
      // If we have a meeting ID from context, make sure we mark the meeting as started
      setMeetingStarted(true);
    }
  }, [contextMeetingId, isMeetingActive]);

  // Keep local controls in sync with parent controls
  useEffect(() => {
    if (parentControlsVisible !== undefined) {
      setControlsVisible(parentControlsVisible);
    }
  }, [parentControlsVisible]);


  // Don't show anything here if there's an active meeting in our context
  // This prevents duplicate UIs - we'll let the VideoConference component handle display
  if (isMeetingActive && contextMeetingId) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[500px] bg-gray-800 text-white p-6 rounded-lg shadow-inner">
        <p>Meeting is currently active in its own overlay window.</p>
      </div>
    );
  }

  return (
    <>
      {isMeetingStarted ? (
        <SnackbarProvider
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          autoHideDuration={5000}
          maxSnack={3}
        >
          <MeetingProvider
            config={{
              meetingId,
              micEnabled: micOn,
              webcamEnabled: webcamOn,
              name: participantName ? participantName : "TestUser",
              debugMode: false,
            }}
            token={token}
            reinitialiseMeetingOnConfigChange={true}
            joinWithoutUserInteraction={true}
          >
            <MeetingContainer
              onMeetingLeave={() => {
                setToken("");
                setMeetingId("");
                setWebcamOn(false);
                setMicOn(false);
                setMeetingStarted(false);

                // Access the videoSDK instance and turn off the webcam
                // const videoSDK = window.VideoSDK;
                // if (videoSDK) {
                //   videoSDK.toggleWebcam(false);
                //   videoSDK.leave();
                //   console.log("video sdk::", videoSDK);
                //}
              }}
              setIsMeetingLeft={setIsMeetingLeft}
              selectedMic={selectedMic}
              selectedWebcam={selectedWebcam}
              selectWebcamDeviceId={selectWebcamDeviceId}
              setSelectWebcamDeviceId={setSelectWebcamDeviceId}
              selectMicDeviceId={selectMicDeviceId}
              setSelectMicDeviceId={setSelectMicDeviceId}
              useRaisedHandParticipants={useRaisedHandParticipants}
              raisedHandsParticipants={raisedHandsParticipants}
              micEnabled={micOn}
              webcamEnabled={webcamOn}
              controlsVisible={controlsVisible}
            />
          </MeetingProvider>
        </SnackbarProvider>
      ) : isMeetingLeft ? (
        <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
      ) : (
        <JoiningScreen
          participantName={participantName}
          setParticipantName={setParticipantName}
          setMeetingId={setMeetingId}
          setToken={setToken}
          setMicOn={setMicOn}
          webcamEnabled={webcamOn}
          micEnabled={micOn}
          setWebcamOn={setWebcamOn}
          onClickStartMeeting={() => {
            setMeetingStarted(true);
          }}
          setIsMeetingLeft={setIsMeetingLeft}
        />
      )}
    </>
  );
}

export default MeetingAppContainer;
