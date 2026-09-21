import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TTheme = 'light' | 'dark' | 'system';

type TAccentShades = {
  50: string;
  400: string;
  500: string;
  600: string;
  700: string;
  950: string;
};

const ACCENT_SHADES: Record<string, TAccentShades> = {
  blue: {
    50: '#eff6ff',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    950: '#172554',
  },
  purple: {
    50: '#faf5ff',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    950: '#3b0764',
  },
  green: {
    50: '#f0fdf4',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    950: '#052e16',
  },
  red: {
    50: '#fef2f2',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    950: '#450a0a',
  },
  orange: {
    50: '#fff7ed',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    950: '#431407',
  },
  yellow: {
    50: '#fefce8',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    950: '#422006',
  },
  pink: {
    50: '#fdf2f8',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    950: '#500724',
  },
  gray: {
    50: '#fafaf9',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    950: '#0c0a09',
  },
};

const applyTheme = (theme: TTheme) => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

const applyAccentColor = (color: string) => {
  const shades = ACCENT_SHADES[color];
  if (!shades) return;
  const root = window.document.documentElement;
  root.style.setProperty('--accent-50', shades[50]);
  root.style.setProperty('--accent-400', shades[400]);
  root.style.setProperty('--accent-500', shades[500]);
  root.style.setProperty('--accent-600', shades[600]);
  root.style.setProperty('--accent-700', shades[700]);
  root.style.setProperty('--accent-950', shades[950]);
};

interface AppearanceState {
  theme: TTheme;
  accentColor: string;
  setTheme: (theme: TTheme) => void;
  setAccentColor: (color: string) => void;
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      theme: 'system',
      accentColor: 'blue',
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      setAccentColor: (color) => {
        applyAccentColor(color);
        set({ accentColor: color });
      },
    }),
    {
      name: 'appearance-storage',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        applyTheme(state.theme);
        applyAccentColor(state.accentColor);
      },
    },
  ),
);
