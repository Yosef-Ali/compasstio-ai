import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface MeetingState {
  meetingId: string | null;
  token: string | null;
  participantName: string;
  controlsVisible: boolean;
  videoState: {
    controlsVisible: boolean;
  };
}

interface MeetingActions {
  setMeetingDetails: (details: { meetingId: string; token: string; participantName: string }) => void;
  setVideoState: (state: { controlsVisible: boolean }) => void;
  resetMeetingState: () => void;
}

const initialState: MeetingState = {
  meetingId: null,
  token: null,
  participantName: '',
  controlsVisible: true,
  videoState: {
    controlsVisible: true,
  },
};

export const useMeetingStore = create<MeetingState & MeetingActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setMeetingDetails: (details) =>
          set(
            {
              meetingId: details.meetingId,
              token: details.token,
              participantName: details.participantName,
            },
            false,
            'setMeetingDetails'
          ),
        setVideoState: (state) =>
          set(
            (prevState) => ({
              videoState: {
                ...prevState.videoState,
                ...state,
              },
            }),
            false,
            'setVideoState'
          ),
        resetMeetingState: () =>
          set(
            initialState,
            false,
            'resetMeetingState'
          ),
      }),
      {
        name: 'meeting-storage',
        partialize: (state) => ({
          meetingId: state.meetingId,
          token: state.token,
          participantName: state.participantName,
        }),
      }
    )
  )
); 