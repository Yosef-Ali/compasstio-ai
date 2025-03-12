import React from 'react';

interface DeviceSelection {
  id: string | null;
  label?: string;
}

interface RaisedHandParticipant {
  participantId: string;
  raisedHandOn: number;
}

interface MeetingConfig {
  meetingId: string;
  micEnabled: boolean;
  webcamEnabled: boolean;
  name: string;
}

interface TabItem {
  name: string;
  title: string;
  content: React.ReactNode;
}

interface MeetingContainerProps {
  onMeetingLeave: () => void;
  setIsMeetingLeft: (left: boolean) => void;
  selectedMic: DeviceSelection;
  selectedWebcam: DeviceSelection;
  selectWebcamDeviceId: string | null;
  setSelectWebcamDeviceId: (id: string | null) => void;
  selectMicDeviceId: string | null;
  setSelectMicDeviceId: (id: string | null) => void;
  participantRaisedHand: (participantId: string) => void;
  raisedHandsParticipants: RaisedHandParticipant[];
  micEnabled: boolean;
  webcamEnabled: boolean;
}

export {
  DeviceSelection,
  RaisedHandParticipant,
  MeetingConfig,
  TabItem,
  MeetingContainerProps
};
