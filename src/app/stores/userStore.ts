import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserStore {
  username: string;
  setUsername: (username: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      username: '',
      setUsername: (username: string) => set({ username }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
