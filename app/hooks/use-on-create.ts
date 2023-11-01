import { create } from "zustand";

type State = {
  isOpen: boolean;
  onCreate: () => void;
  toggleOpen: (isOpen: boolean) => void;
};

export const useOnCreate = create<State>((set) => ({
  isOpen: false,
  onCreate: () => {},
  toggleOpen: (isOpen) => set({ isOpen }),
}));
