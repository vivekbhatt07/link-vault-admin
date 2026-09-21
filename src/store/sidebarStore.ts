import { create } from 'zustand';

type TSidebarStore = {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleOpen: () => void;
  close: () => void;
  toggleCollapsed: () => void;
};

export const useSidebarStore = create<TSidebarStore>((set) => ({
  isOpen: false,
  isCollapsed: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
