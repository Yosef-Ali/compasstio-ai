"use client";
import React, { useState, useEffect } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { BottomBar } from "../BottomBar";
import { ParticipantsViewer } from "./ParticipantView";
import { useSnackbar } from "notistack";
import useResponsiveSize from "@/utils/useResponsiveSize";
import WaitingToJoin from "../WaitingToJoin";
import useWindowSize from "@/utils/useWindowSize";
import { useMeetingAppContext } from "@/MeetingAppContextDef";
import { useMeetingStore } from "@/hooks/useMeetingStore";

interface MeetingContainerProps {
  onMeetingLeave: () => void;
  setIsMeetingLeft: (left: boolean) => void;
}

export const MeetingContainer = ({
  onMeetingLeave,
  setIsMeetingLeft,
}: MeetingContainerProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    meetingId: contextMeetingId,
    micDeviceId,
    webcamDeviceId,
    setMicDeviceId,
    setWebcamDeviceId,
    sideBarMode,
    setSideBarMode
  } = useMeetingAppContext();

  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  const responsiveSize = useResponsiveSize();
  const isMobile = responsiveSize === 1;
  const isTab = responsiveSize === 2;
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
    onParticipantJoined: (participant) => {
      enqueueSnackbar(`${participant.displayName} joined the meeting`, {
        variant: "success",
      });
    },
    onParticipantLeft: (participant) => {
      enqueueSnackbar(`${participant.displayName} left the meeting`, {
        variant: "info",
      });
    },
    onMeetingLeft: () => {
      setIsMeetingLeft(true);
      onMeetingLeave();
    },
    onError: (error: { message: string }) => {
      setMeetingError(error.message);
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  // Handle devices and cleanup
  useEffect(() => {
    if (!meeting) return;

    const updateDevices = async () => {
      try {
        if (micDeviceId) {
          await meeting.changeMic(micDeviceId);
        }
        if (webcamDeviceId) {
          await meeting.changeWebcam(webcamDeviceId);
        }
      } catch (error) {
        console.error("Failed to update devices:", error);
        enqueueSnackbar("Failed to update devices", { variant: "error" });
      }
    };

    updateDevices();

    return () => {
      // Clean up meeting resources when unmounting
      if (meeting) {
        meeting.leave();
      }
    };
  }, [webcamDeviceId, micDeviceId, meeting, enqueueSnackbar]);

  // Sync container dimensions
  useEffect(() => {
    if (windowWidth && windowHeight) {
      setContainerHeight(windowHeight);
      setContainerWidth(windowWidth);
    }
  }, [windowWidth, windowHeight]);

  // Show loading state while connecting
  if (!meetingId) {
    return <WaitingToJoin />;
  }

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
            pinnedParticipant={undefined}
          />
        </div>

        {isControlsVisible && (
          <BottomBar
            bottomBarHeight={bottomBarHeight}
            setIsMeetingLeft={setIsMeetingLeft}
            selectWebcamDeviceId={webcamDeviceId}
            setSelectWebcamDeviceId={setWebcamDeviceId}
            selectMicDeviceId={micDeviceId}
            setSelectMicDeviceId={setMicDeviceId}
            controlsVisible={isControlsVisible}
            sideBarMode={sideBarMode}
            setSideBarMode={setSideBarMode}
          />
        )}
      </div>
    </div>
  );
};
