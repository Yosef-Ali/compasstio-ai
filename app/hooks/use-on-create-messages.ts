// import { create } from "zustand";

// interface StoreState {
//   id: string;
//   role: string;
//   content: string;
// }

// // Define a store that holds id, role and content
// export const useMessageStore = create<StoreState>((set) => ({
//   id: "",
//   role: "",
//   content: "",
//   // Update the state by passing a partial object
//   updateMessage: (data: StoreState | Partial<StoreState>) =>
//     set((state) => ({ ...state, ...data })),
//   // Reset the state to the initial values
//   // reset: () => set({ id: "", role: "", content: "" }),
// }));

import { create } from "zustand";

interface StoreState {
  id: string;
  role: string;
  content: string;
  conversationId: string;
  setId: (id: string) => void;
  setRole: (role: string) => void;
  setContent: (content: string) => void;
  setConversationId: (conversationId: string) => void;
}

export const useMessageStore = create<StoreState>((set) => ({
  id: "",
  role: "",
  content: "",
  conversationId: "",

  setId: (id: string) => set({ id }),
  setRole: (role: string) => set({ role }),
  setContent: (content: string) => set({ content }),
  setConversationId: (conversationId: string) => set({ conversationId }),
  updateMessage: (data: StoreState | Partial<StoreState>) =>
    set((state) => ({ ...state, ...data })),
  reset: () => set({ id: "", role: "", content: "", conversationId: "" }),
}));
