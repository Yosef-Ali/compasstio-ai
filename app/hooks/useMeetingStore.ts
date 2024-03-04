import { create } from 'zustand';

interface StoreState {
  meetingId: string | null;
  token: string | null;
  joinedMeeting: boolean;
  setMeetingId: (meetingId: string | null) => void;
  setToken: (token: string | null) => void;
  setJoinedMeeting: (joinMeeting: boolean) => void;
}

const useMeetingStore = create<StoreState>((set) => ({
  meetingId: null,
  token: null,
  joinedMeeting: false,
  setMeetingId: (meetingId) => set({ meetingId }),
  setToken: (token) => set({ token }),
  setJoinedMeeting: (joinedMeeting) => set({ joinedMeeting }),
}));

export default useMeetingStore;