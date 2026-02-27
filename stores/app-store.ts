import { create } from 'zustand';
import type { MarkerCategory } from '@/types/database';

type AppStore = {
  selectedCategory: MarkerCategory | null;
  setSelectedCategory: (category: MarkerCategory | null) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

export const useAppStore = create<AppStore>()((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
