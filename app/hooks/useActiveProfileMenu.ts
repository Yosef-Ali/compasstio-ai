import { create } from "zustand";

interface ActiveMenuItemState {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export const useActiveMenu = create<ActiveMenuItemState>((set) => ({
  activeItem: "Messages", // Initial active item
  setActiveItem: (item) => set({ activeItem: item }),
}));