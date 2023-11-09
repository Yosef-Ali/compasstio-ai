import { create } from "zustand";

type State = {
  activeMember: string;
  setActiveMember: (id: string) => void;
};

export const useOnGroupSelect = create<State>((set) => ({
  activeMember: "",
  setActiveMember: (id) => set({ activeMember: id }),
}));
