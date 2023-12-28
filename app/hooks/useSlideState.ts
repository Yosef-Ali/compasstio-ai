import { create } from "zustand";

interface SlideState {
  isSlideOut: boolean;
  toggleSlide: () => void;
}

export const useSlideState = create<SlideState>((set) => ({
  isSlideOut: false,
  toggleSlide: () => set((state) => ({ isSlideOut: !state.isSlideOut })),
}));





