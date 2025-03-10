"use client";
import React, { useState, useEffect, useRef } from "react";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { BottomBar } from "../BottomBar";
import { SidebarConatiner } from "../SidebarContainer/SidebarContainer";
import { ParticipantsViewer } from "./ParticipantView";
import { PresenterView } from "./PresenterView";
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
}) {
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const mMeetingRef = useRef();
  const [localParticipantAllowedJoin, setLocalParticipantAllowedJoin] =
    useState(null);
  const containerRef = useRef();
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
      if (currentMeetingId) {
        removeMeeting({ meetingId: currentMeetingId });
      }
    };

    // Add an event listener for the window.onbeforeunload event
    window.addEventListener('beforeunload', removeCurrentMeeting);

    // Return a cleanup function that removes the event listener and the meeting
    return () => {
      window.removeEventListener('beforeunload', removeCurrentMeeting);
      removeCurrentMeeting();
    };
  }, []);

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

  function onParticipantJoined(participant) {
    // console.log(" onParticipantJoined", participant);
  }
  function onParticipantLeft(participant) {
    // console.log(" onParticipantLeft", participant);
  }
  const onSpeakerChanged = (activeSpeakerId) => {
    // console.log(" onSpeakerChanged", activeSpeakerId);
  };
  function onPresenterChanged(presenterId) {
    // console.log(" onPresenterChanged", presenterId);
  }
  function onMainParticipantChanged(participant) {
    // console.log(" onMainParticipantChanged", participant);
  }
  function onEntryRequested(participantId, name) {
    // console.log(" onEntryRequested", participantId, name);
  }
  function onEntryResponded(participantId, name) {
    // console.log(" onEntryResponded", participantId, name);
    if (mMeetingRef.current?.localParticipant?.id === participantId) {
      if (name === "allowed") {
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
  function onChatMessage(data) {
    // console.log(" onChatMessage", data);
  }
  async function onMeetingJoined() {
    // console.log("onMeetingJoined");
    const { changeWebcam, changeMic, muteMic, disableWebcam } =
      mMeetingRef.current;

    if (webcamEnabled && selectedWebcam.id) {
      await new Promise((resolve) => {
        disableWebcam();
        setTimeout(() => {
          changeWebcam(selectedWebcam.id);
          resolve();
        }, 500);
      });
    }

    if (micEnabled && selectedMic.id) {
      await new Promise((resolve) => {
        muteMic();
        setTimeout(() => {
          changeMic(selectedMic.id);
          resolve();
        }, 500);
      });
    }

  }
  function onMeetingLeft() {
    removeMeeting({ userId: user.id });
    setMeetingId(null);
    onMeetingLeave();
  }
  const onLiveStreamStarted = (data) => {
    // console.log("onLiveStreamStarted example", data);
  };
  const onLiveStreamStopped = (data) => {
    // console.log("onLiveStreamStopped example", data);
  };

  const onVideoStateChanged = (data) => {
    // console.log("onVideoStateChanged", data);
  };
  const onVideoSeeked = (data) => {
    // console.log("onVideoSeeked", data);
  };

  const onWebcamRequested = (data) => {
    // console.log("onWebcamRequested", data);
  };
  const onMicRequested = (data) => {
    // console.log("onMicRequested", data);
  };
  const onPinStateChanged = (data) => {
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

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);


  const isPresenting = mMeeting.presenterId ? true : false;

  const bottomBarHeight = 60;
  const [sideBarMode, setSideBarMode] = useState(null);
  const [controlsVisible, setControlsVisible] = useState(false);

  usePubSub("RAISE_HAND", {
    onMessageReceived: (data) => {
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
    onMessageReceived: (data) => {
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

  const _windowHeight = windowHeight * 0.9;


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
        !mMeeting.isMeetingJoined && <WaitingToJoin />
      )}
    </div>
  );
}
