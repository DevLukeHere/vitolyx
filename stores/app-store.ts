import { create } from 'zustand';

type AppStore = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

export const useAppStore = create<AppStore>()((set) => ({
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
