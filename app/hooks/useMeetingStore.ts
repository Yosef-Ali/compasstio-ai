import { create } from 'zustand';

interface StoreState {
  meetingId: string | null;
  token: string | null;
  joinedMeeting: boolean;
  videoState: boolean;
  setMeetingId: (meetingId: string | null) => void;
  setToken: (token: string | null) => void;
  setJoinedMeeting: (joinMeeting: boolean) => void;
  setVideoState: (state: boolean) => void;
}

export const useMeetingStore = create<StoreState>((set) => ({
  meetingId: null,
  token: null,
  joinedMeeting: false,
  videoState: false,
  setMeetingId: (meetingId) => set({ meetingId }),
  setToken: (token) => set({ token }),
  setJoinedMeeting: (joinedMeeting) => set({ joinedMeeting }),
  setVideoState: (videoState) => set({ videoState }),
}));
