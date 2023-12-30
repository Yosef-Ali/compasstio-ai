import { create } from 'zustand';
import { Id } from '@/convex/_generated/dataModel';

interface ActiveFriendStore {
  activeFriendId: string | null;
  setActiveFriendId: (id: string) => void;
}

const useActiveFriendStore = create<ActiveFriendStore>(
  (set) => ({
    activeFriendId: null,
    setActiveFriendId: (id) => set({ activeFriendId: id }),
  }),
  
);


export default useActiveFriendStore;
