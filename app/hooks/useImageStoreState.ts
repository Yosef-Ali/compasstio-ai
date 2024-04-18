import { create } from 'zustand';

interface ImageStoreState {
  hoverImageIndex: number;
  setHoverImageIndex: (index: number) => void;
}

const useImageStore = create<ImageStoreState>((set) => ({
  hoverImageIndex: 0,
  setHoverImageIndex: (index) => set({ hoverImageIndex: index }),
}));

export default useImageStore;
