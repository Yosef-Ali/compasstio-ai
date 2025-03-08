"use client";
import React, { useState, useEffect } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { BottomBar } from "../BottomBar";
import { ParticipantsViewer } from "./ParticipantView";
import { useSnackbar } from "notistack";
import useResponsiveSize from "@/utils/useResponsiveSize";
import WaitingToJoin from "../WaitingToJoin";
import useWindowSize from "@/utils/useWindowSize";

interface MeetingContainerProps {
  onMeetingLeave: () => void;
  setIsMeetingLeft: (left: boolean) => void;
  selectedMic: { id: string | null };
  selectedWebcam: { id: string | null };
  selectWebcamDeviceId: string | null;
  setSelectWebcamDeviceId: (id: string | null) => void;
  selectMicDeviceId: string | null;
  setSelectMicDeviceId: (id: string | null) => void;
}

export const MeetingContainer = ({
  onMeetingLeave,
  setIsMeetingLeft,
  selectedMic,
  selectedWebcam,
  selectWebcamDeviceId,
  setSelectWebcamDeviceId,
  selectMicDeviceId,
  setSelectMicDeviceId,
}: MeetingContainerProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  const { isMobile, isTab } = useResponsiveSize();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  
  const bottomBarHeight = 60;

  const {
    meetingId,
    meeting,
    localParticipant,
    participants,
    presenterId,
    localMicOn,
    localWebcamOn,
    isRecording,
    connectTo,
    leave,
  } = useMeeting({
    onError: (error) => {
      setMeetingError(error.message);
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  useEffect(() => {
    setContainerHeight(windowHeight);
    setContainerWidth(windowWidth);
  }, [windowHeight, windowWidth]);

  return (
    <div
      className="h-screen bg-gray-800"
      onMouseEnter={() => setIsControlsVisible(true)}
      onMouseLeave={() => setIsControlsVisible(false)}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 relative">
          <ParticipantsViewer
            participants={participants}
            isPresenting={!!presenterId}
            localParticipant={localParticipant}
            pinnedParticipant={null}
          />
        </div>
        
        {isControlsVisible && (
          <BottomBar
            bottomBarHeight={bottomBarHeight}
            setIsMeetingLeft={setIsMeetingLeft}
            isMobile={isMobile}
            isTab={isTab}
          />
        )}
      </div>
    </div>
  );
};
