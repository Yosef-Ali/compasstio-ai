"use client";
import React, { useEffect, useState, useCallback } from "react";
import { JoiningScreen } from "../components/JoiningScreen";
import { MeetingContainer } from "../components/MeetingContainer/MeetingContainer";
import { SnackbarProvider } from "notistack";
import { LeaveScreen } from "../components/LeaveScreen";
import { useTheme } from "@material-ui/core";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import {
  DeviceSelection,
  MeetingConfig,
} from "@/types/video-chat";
import useRaisedHandParticipants from "@/app/hooks/useRaisedHandParticipants";
import useWindowSize from "@/utils/useWindowSize";

interface MeetingAppContainerProps {
  controlsVisible?: boolean;
}

function MeetingAppContainer({ controlsVisible = true }: MeetingAppContainerProps): JSX.Element {
  // Meeting state
  const [token, setToken] = useState<string>("");
  const [meetingId, setMeetingId] = useState<string>("");
  const [participantName, setParticipantName] = useState<string>("");

  // Media device states
  const [micOn, setMicOn] = useState<boolean>(true);
  const [webcamOn, setWebcamOn] = useState<boolean>(true);
  const [selectedMic, setSelectedMic] = useState<DeviceSelection>({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState<DeviceSelection>({ id: null });
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState<string | null>(null);
  const [selectMicDeviceId, setSelectMicDeviceId] = useState<string | null>(null);

  // Meeting flow states
  const [isMeetingStarted, setMeetingStarted] = useState<boolean>(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState<boolean>(false);

  // Hooks
  const theme = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const { participantRaisedHand, raisedHandsParticipants } = useRaisedHandParticipants();

  // Set up beforeunload handler to prevent accidental exits
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };

      return () => {
        window.onbeforeunload = null;
      };
    }
  }, []);

  // Update device IDs when selections change
  useEffect(() => {
    setSelectWebcamDeviceId(selectedWebcam.id);
  }, [selectedWebcam]);

  useEffect(() => {
    setSelectMicDeviceId(selectedMic.id);
  }, [selectedMic]);

  // Handler for meeting leave
  const handleMeetingLeave = useCallback(() => {
    setToken("");
    setMeetingId("");
    setWebcamOn(false);
    setMicOn(false);
    setMeetingStarted(false);
  }, []);

  // Handler for starting a meeting
  const handleStartMeeting = useCallback(() => {
    setMeetingStarted(true);
  }, []);

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
              name: participantName || "TestUser",
            } as MeetingConfig}
            token={token}
            reinitialiseMeetingOnConfigChange={true}
            joinWithoutUserInteraction={true}
          >
            <MeetingContainer
              onMeetingLeave={handleMeetingLeave}
              setIsMeetingLeft={setIsMeetingLeft}
              selectedMic={selectedMic}
              selectedWebcam={selectedWebcam}
              selectWebcamDeviceId={selectWebcamDeviceId}
              setSelectWebcamDeviceId={setSelectWebcamDeviceId}
              selectMicDeviceId={selectMicDeviceId}
              setSelectMicDeviceId={setSelectMicDeviceId}
              micEnabled={micOn}
              webcamEnabled={webcamOn}
              controlsVisible={controlsVisible}
              raisedHandsParticipants={raisedHandsParticipants}
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
          setWebcamOn={setWebcamOn}
          micEnabled={micOn}
          webcamEnabled={webcamOn}
          onClickStartMeeting={handleStartMeeting}
          setIsMeetingLeft={setIsMeetingLeft}
        />
      )}
    </>
  );
}

export default MeetingAppContainer;
