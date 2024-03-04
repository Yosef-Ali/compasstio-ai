import { create } from 'zustand';

interface MeetingIdStore {
  currentMeetingId: string | null;
  setMeetingId: (meetingId: string | null) => void;
}

const useMeetingIdStore = create<MeetingIdStore>((set) => ({
  currentMeetingId: null,
  setMeetingId: (meetingId: string | null) => set({ currentMeetingId: meetingId }),
}));

export default useMeetingIdStore;
