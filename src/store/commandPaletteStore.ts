import { create } from 'zustand';

type TCommandPaletteStore = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  toggle: () => void;
};

export const useCommandPaletteStore = create<TCommandPaletteStore>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
