import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark';
  searchOpen: boolean;
  createPostOpen: boolean;
  toggleTheme: () => void;
  setSearchOpen: (open: boolean) => void;
  setCreatePostOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  searchOpen: false,
  createPostOpen: false,
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'dark' ? 'light' : 'dark' 
  })),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setCreatePostOpen: (open) => set({ createPostOpen: open }),
}));
