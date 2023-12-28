import { create } from "zustand";

interface SlideState {
  isSlideOutMobile: boolean;
  toggleSlideMobile: () => void;
}

export const useSlideStateMobile = create<SlideState>((set) => ({
  isSlideOutMobile: true, // Add the missing property
  toggleSlideMobile: () => set((state) => ({ isSlideOutMobile: !state.isSlideOutMobile })),
}));





