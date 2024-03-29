
import { create } from 'zustand';

interface Group {
  id: string;
  name: string;
}

interface GroupSelectedState {
  items: string[];
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
}

const useGroupSelected = create<GroupSelectedState>(set => ({
  items: [],
  toggleItem: (id) => set(state => ({
    items: state.items.includes(id)
      ? state.items.filter(i => i !== id)
      : [...state.items, id]
  })),
  deleteItem: (id) => set(state => ({
    items: state.items.filter(i => i !== id)
  }))
}));

export default useGroupSelected;