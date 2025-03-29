import React, { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { JoiningScreen } from "../components/JoiningScreen";
import { MeetingContainer, MeetingContainerProps } from "../components/MeetingContainer/MeetingContainer";
import { SnackbarProvider } from "notistack";
import { LeaveScreen } from "../components/LeaveScreen";
import { ThemeProvider, useMediaQuery, useTheme } from "@material-ui/core";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import generateMuiTheme from "@/mui/theme";

interface MicWebcam {
  id: string | null;
}

interface MeetingAppContainerProps {}

function MeetingAppContainer({}: MeetingAppContainerProps) {
  const [token, setToken] = useState<string>("");
  const [meetingId, setMeetingId] = useState<string>("");
  const [participantName, setParticipantName] = useState<string>("");
  const [micOn, setMicOn] = useState<boolean>(true);
  const [webcamOn, setWebcamOn] = useState<boolean>(true);
  const [selectedMic, setSelectedMic] = useState<MicWebcam>({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState<MicWebcam>({ id: null });
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState<string | null>(
    selectedWebcam.id
  );
  const [selectMicDeviceId, setSelectMicDeviceId] = useState<string | null>(selectedMic.id);
  const [isMeetingStarted, setMeetingStarted] = useState<boolean>(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState<boolean>(false);
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<
    { participantId: string; raisedHandOn: number }[]
  >([]);


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
