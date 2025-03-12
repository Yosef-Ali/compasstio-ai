"use client";
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { useMeeting } from "@videosdk.live/react-sdk";
import { useSnackbar } from "notistack";
import useResponsiveSize from "@/utils/useResponsiveSize";
import WaitingToJoin from "../WaitingToJoin";
import { BottomBar } from "../BottomBar.jsx";
import { ParticipantsViewer } from "./ParticipantView.jsx";

export const sideBarModes = {
  PARTICIPANTS: "PARTICIPANTS",
  CHAT: "CHAT",
};

export const MeetingContainer = ({
  onMeetingLeave,
  setIsMeetingLeft,
  selectedMic,
  selectedWebcam,
  selectWebcamDeviceId,
  setSelectWebcamDeviceId,
  selectMicDeviceId,
  setSelectMicDeviceId,
  controlsVisible
}) => {
  const [sideBarMode, setSideBarMode] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const {
    meeting,
    participants,
    presenterId,
    localParticipant,
  } = useMeeting({
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          {meeting ? (
            <ParticipantsViewer
              isPresenting={!!presenterId}
              sideBarMode={sideBarMode}
              participants={participants}
              localParticipant={localParticipant}
            />
          ) : <WaitingToJoin />}
        </div>
      </div>

      {controlsVisible && (
        <div className="relative z-10 bg-gray-800 border-t border-gray-700">
          <BottomBar
            bottomBarHeight={80}
            sideBarMode={sideBarMode}
            setSideBarMode={setSideBarMode}
            setIsMeetingLeft={setIsMeetingLeft}
            selectWebcamDeviceId={selectWebcamDeviceId}
            setSelectWebcamDeviceId={setSelectWebcamDeviceId}
            selectMicDeviceId={selectMicDeviceId}
            setSelectMicDeviceId={setSelectMicDeviceId}
            controlsVisible={controlsVisible}
          />
        </div>
      )}
    </div>
  );
};

MeetingContainer.propTypes = {
  onMeetingLeave: PropTypes.func.isRequired,
  setIsMeetingLeft: PropTypes.func.isRequired,
  selectedMic: PropTypes.shape({
    id: PropTypes.string
  }),
  selectedWebcam: PropTypes.shape({
    id: PropTypes.string
  }),
  selectWebcamDeviceId: PropTypes.string,
  setSelectWebcamDeviceId: PropTypes.func,
  selectMicDeviceId: PropTypes.string,
  setSelectMicDeviceId: PropTypes.func,
  controlsVisible: PropTypes.bool.isRequired
};
