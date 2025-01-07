import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface TeacherState {
  messages: Message[];
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  clearMessages: () => void;
  deleteMessage: (id: string) => void;
}

export const useTeacherStore = create<TeacherState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: Date.now().toString(),
              timestamp: Date.now(),
            },
          ],
        })),
      clearMessages: () => set({ messages: [] }),
      deleteMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
        })),
    }),
    {
      name: "teacher-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
