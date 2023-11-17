import { create } from "zustand";

type Status = {
  value: string;
  label: string;
  icon: React.ElementType<any>;
};

type State = {
  open: boolean;
  selectedTaskStatus: Status | null;
  setOpen: (value: boolean) => void;
  setSelectedTaskStatus: (value: Status | null) => void;
};

export const useTaskStatus = create<State>((set) => ({
  open: false,
  selectedTaskStatus: null,
  setOpen: (value) => set({ open: value }),
  setSelectedTaskStatus: (value) => set({ selectedTaskStatus: value }),
}));
