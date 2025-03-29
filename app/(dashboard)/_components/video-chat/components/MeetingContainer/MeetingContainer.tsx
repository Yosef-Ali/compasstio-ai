"use client";
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { BottomBar } from "../BottomBar";
import { SidebarConatiner } from "../SidebarContainer/SidebarContainer";
import { ParticipantsViewer } from "./ParticipantView";
import { PresenterView } from "./PresenterView"; // Changed to named import
import { useSnackbar } from "notistack";
import { nameTructed, trimSnackBarText } from "@/utils/helper";
import useResponsiveSize from "@/utils/useResponsiveSize";
import WaitingToJoin from "../WaitingToJoin";
import useWindowSize from "@/utils/useWindowSize";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import useMeetingIdStore from "@/app/hooks/useMeetingIdStore";
import { useUser } from "@clerk/nextjs";

export const sideBarModes = {
  PARTICIPANTS: "PARTICIPANTS",
  CHAT: "CHAT",
};

interface MicWebcam {
  id: string | null;
}

export interface MeetingContainerProps {
  onMeetingLeave: () => void;
  setIsMeetingLeft: Dispatch<SetStateAction<boolean>>;
  selectedMic: MicWebcam;
  selectedWebcam: MicWebcam;
  selectWebcamDeviceId: string | null;
  setSelectWebcamDeviceId: Dispatch<SetStateAction<string | null>>;
  selectMicDeviceId: string | null;
  setSelectMicDeviceId: Dispatch<SetStateAction<string | null>>;
  useRaisedHandParticipants: () => { participantRaisedHand: (participantId: string) => void };
  raisedHandsParticipants: { participantId: string; raisedHandOn: number }[];
  micEnabled: boolean;
  webcamEnabled: boolean;
}

export function MeetingContainer({
  onMeetingLeave,
  setIsMeetingLeft,
  selectedMic,
  selectedWebcam,
  selectWebcamDeviceId,
  setSelectWebcamDeviceId,
  selectMicDeviceId,
  setSelectMicDeviceId,
  useRaisedHandParticipants,
  raisedHandsParticipants,
  micEnabled,
  webcamEnabled,
}: MeetingContainerProps) {
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const mMeetingRef = useRef<any>();
  const [localParticipantAllowedJoin, setLocalParticipantAllowedJoin] =
    useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const meetingIdStore = useMeetingIdStore();
  const user = useUser();
  const { currentMeetingId, setMeetingId } = meetingIdStore;

  const saveMeetingId = useMutation(api.meetings.saveMeetingId);
  const removeMeeting = useMutation(api.meetings.removeMeeting);

  const { meetingId } = useMeeting();

  // Add this code in MeetingContainer.js to save meetingId into convex
  useEffect(() => {
    if (meetingId) {
      setMeetingId(meetingId);
      saveMeetingId({ meetingId });
    }
  }, [meetingId, setMeetingId, saveMeetingId]);

  //clear meeting when window is closed
  useEffect(() => {
    // Define a function that removes the meeting
    const removeCurrentMeeting = () => {
      if (currentMeetingId && user.user?.id) {
        removeMeeting({ userId: user.user.id });
      }
    };

    // Add an event listener for the window.onbeforeunload event
    window.addEventListener('beforeunload', removeCurrentMeeting);

    // Return a cleanup function that removes the event listener and the meeting
    return () => {
      window.removeEventListener('beforeunload', removeCurrentMeeting);
      removeCurrentMeeting();
    };
  }, [currentMeetingId, user.user?.id, removeMeeting]);

  const presentingSideBarWidth = useResponsiveSize({
    xl: 320,
    lg: 280,
    md: 260,
    sm: 240,
    xs: 200,
  });

  useEffect(() => {
    containerRef.current?.offsetHeight &&
      setContainerHeight(containerRef.current.offsetHeight);
    containerRef.current?.offsetWidth &&
      setContainerWidth(containerRef.current.offsetWidth);

    window.addEventListener("resize", ({ target }) => {
      containerRef.current?.offsetHeight &&
        setContainerHeight(containerRef.current.offsetHeight);
      containerRef.current?.offsetWidth &&
        setContainerWidth(containerRef.current.offsetWidth);
    });
  }, []);

  const { participantRaisedHand } = useRaisedHandParticipants();

  const _handleMeetingLeft = () => {
    setIsMeetingLeft(true);
  };

  function onParticipantJoined(participant: any) {
    // console.log(" onParticipantJoined", participant);
  }
  function onParticipantLeft(participant: any) {
    // console.log(" onParticipantLeft", participant);
  }
  const onSpeakerChanged = (activeSpeakerId: string | null) => { // Allow null
    // console.log(" onSpeakerChanged", activeSpeakerId);
  };
  function onPresenterChanged(presenterId: string | null) { // Allow null
    // console.log(" onPresenterChanged", presenterId);
  }
  function onMainParticipantChanged(participant: any) {
    // console.log(" onMainParticipantChanged", participant);
  }
  // Adjust signature based on SDK type definition
  function onEntryRequested({ participantId, name, allow, deny }: { participantId: string; name: string; allow: () => void; deny: () => void; }) {
    // console.log(" onEntryRequested", participantId, name);
    // Implement logic to allow/deny entry, e.g., show a notification and call allow() or deny()
  }
  // Adjust signature based on SDK type definition
  function onEntryResponded({ participantId, decision }: { participantId: string; decision: string; }) {
    // console.log(" onEntryResponded", participantId, decision);
    if (mMeetingRef.current?.localParticipant?.id === participantId) {
      if (decision === "allowed") {
        setLocalParticipantAllowedJoin(true);
      } else {
        setLocalParticipantAllowedJoin(false);
        setTimeout(() => {
          _handleMeetingLeft();
        }, 3000);
      }
    }
  }
  function onRecordingStarted() {
    // console.log(" onRecordingStarted");
  }
  function onRecordingStopped() {
    // console.log(" onRecordingStopped");
  }
  function onChatMessage(data: any) {
    // console.log(" onChatMessage", data);
  }
  async function onMeetingJoined() {
    // console.log("onMeetingJoined");
    const { changeWebcam, changeMic, muteMic, disableWebcam } =
      mMeetingRef.current;

    if (webcamEnabled && selectedWebcam.id) {
      await new Promise<void>((resolve) => {
        disableWebcam();
        setTimeout(() => {
          changeWebcam(selectedWebcam.id);
          resolve();
        }, 500);
      });
    }

    if (micEnabled && selectedMic.id) {
      await new Promise<void>((resolve) => {
        muteMic();
        setTimeout(() => {
          changeMic(selectedMic.id);
          resolve();
        }, 500);
      });
    }

  }
  function onMeetingLeft() {
    // Use userId as indicated by the TypeScript error
    if (user.user?.id) {
      removeMeeting({ userId: user.user.id });
    }
    setMeetingId(null);
    onMeetingLeave();
  }
  // Adjust signature based on SDK type definition
  const onLiveStreamStarted = () => {
    // console.log("onLiveStreamStarted example");
  };
  // Adjust signature based on SDK type definition
  const onLiveStreamStopped = () => {
    // console.log("onLiveStreamStopped example");
  };

  // Adjust signature based on SDK type definition
  const onVideoStateChanged = () => {
    // console.log("onVideoStateChanged");
  };
  // Adjust signature based on SDK type definition
  const onVideoSeeked = () => {
    // console.log("onVideoSeeked");
  };

  const onWebcamRequested = (data: any) => {
    // console.log("onWebcamRequested", data);
  };
  const onMicRequested = (data: any) => {
    // console.log("onMicRequested", data);
  };
  const onPinStateChanged = (data: any) => {
    // console.log("onPinStateChanged", data);
  };

  const mMeeting = useMeeting({
    onParticipantJoined,
    onParticipantLeft,
    onSpeakerChanged,
    onPresenterChanged,
    onMainParticipantChanged,
    onEntryRequested,
    onEntryResponded,
    onRecordingStarted,
    onRecordingStopped,
    onChatMessage,
    onMeetingJoined,
    onMeetingLeft,
    onLiveStreamStarted,
    onLiveStreamStopped,
    onVideoStateChanged,
    onVideoSeeked,
    onWebcamRequested,
    onMicRequested,
    onPinStateChanged,
  });

  // Get participants from useMeeting hook
  const { participants } = mMeeting;

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);


  const isPresenting = mMeeting.presenterId ? true : false;

  const bottomBarHeight = 60;
  const [sideBarMode, setSideBarMode] = useState<string | null>(null);
  const [controlsVisible, setControlsVisible] = useState<boolean>(false);

  usePubSub("RAISE_HAND", {
    onMessageReceived: (data: any) => {
      const localParticipantId = mMeeting?.localParticipant?.id;

      const { senderId, senderName } = data;

      const isLocal = senderId === localParticipantId;

      new Audio(
        `https://static.videosdk.live/prebuilt/notification.mp3`
      ).play();

      enqueueSnackbar(
        `${isLocal ? "You" : nameTructed(senderName, 15)} raised hand 🖐🏼`
      );

      participantRaisedHand(senderId);
    },
  });

  usePubSub("CHAT", {
    onMessageReceived: (data: any) => {
      const localParticipantId = mMeeting?.localParticipant?.id;

      const { senderId, senderName, message } = data;

      const isLocal = senderId === localParticipantId;

      if (!isLocal) {
        new Audio(
          `https://static.videosdk.live/prebuilt/notification.mp3`
        ).play();

        enqueueSnackbar(
          trimSnackBarText(`${nameTructed(senderName, 15)} says: ${message}`)
        );
      }
    },
  });
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  const _windowHeight = (windowHeight || 0) * 0.9; // Add default value


  return (
    <div
      style={{ height: windowHeight }}
      ref={containerRef}
      className="h-screen flex flex-col bg-gray-800 relative group"
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(false)}
    >
      {typeof localParticipantAllowedJoin === "boolean" ? (
        localParticipantAllowedJoin ? (
          <div className="flex flex-col h-full overflow-hidden relative">
            {/* Main content area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Video area */}
              <div className={`flex-1 min-h-0 transition-all duration-300 relative ${sideBarMode ? 'w-3/4' : 'w-full'}`}>
                {isPresenting ? (
                  <PresenterView height={containerHeight - bottomBarHeight} />
                ) : (
                  <ParticipantsViewer
                    isPresenting={isPresenting}
                    sideBarMode={sideBarMode}
                    participants={participants} // Pass participants prop
                  />
                )}

                {/* Bottom control bar with transition effect - partially visible by default */}
                <div
                  className="absolute left-0 right-0 transition-transform duration-300 ease-in-out bg-gray-800 bg-opacity-95 border-t border-gray-700 px-4 py-2 backdrop-blur-sm"
                  style={{
                    zIndex: 100,
                    bottom: 70,
                    transform: controlsVisible ? 'translateY(0)' : 'translateY(70px)',
                  }}
                >
                  <BottomBar
                    bottomBarHeight={bottomBarHeight}
                    sideBarMode={sideBarMode}
                    setSideBarMode={setSideBarMode}
                    setIsMeetingLeft={setIsMeetingLeft}
                    selectWebcamDeviceId={selectWebcamDeviceId}
                    setSelectWebcamDeviceId={setSelectWebcamDeviceId}
                    selectMicDeviceId={selectMicDeviceId}
                    setSelectMicDeviceId={setSelectMicDeviceId}
                    controlsVisible={controlsVisible} // Pass controlsVisible prop
                  />
                </div>
              </div>

              {/* Sidebar */}
              {sideBarMode && (
                <div className="w-1/4 border-l border-gray-700">
                  <SidebarConatiner
                    height={containerHeight - bottomBarHeight}
                    setSideBarMode={setSideBarMode}
                    sideBarMode={sideBarMode}
                    raisedHandsParticipants={raisedHandsParticipants}
                  />
                </div>
              )}
            </div>
          </div>
        ) : null
      ) : (
        // Check if localParticipant exists to determine if joined
        !mMeeting.localParticipant && <WaitingToJoin />
      )}
    </div>
  );
}
