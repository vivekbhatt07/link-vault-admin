import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TSidebarStore = {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleOpen: () => void;
  close: () => void;
  toggleCollapsed: () => void;
};

export const useSidebarStore = create<TSidebarStore>()(
  persist(
    (set) => ({
      isOpen: false,
      isCollapsed: false,
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      close: () => set({ isOpen: false }),
      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: 'sidebar-storage',
      // The mobile drawer should never reopen on reload.
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    },
  ),
);
