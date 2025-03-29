import { create } from 'zustand';

interface MeetingIdStore {
  currentMeetingId: string | null;
  token: string | null;
  participantName: string | null; // Add participantName
  setMeetingId: (meetingId: string | null) => void;
  setToken: (token: string | null) => void;
  setParticipantName: (participantName: string | null) => void; // Add setParticipantName
}

const useMeetingIdStore = create<MeetingIdStore>((set) => ({
  currentMeetingId: null,
  token: null,
  participantName: null, // Initialize participantName
  setMeetingId: (meetingId: string | null) => set({ currentMeetingId: meetingId }),
  setToken: (token: string | null) => set({ token }),
  setParticipantName: (participantName: string | null) => set({ participantName: participantName }), // Implement setParticipantName
}));

export default useMeetingIdStore;
