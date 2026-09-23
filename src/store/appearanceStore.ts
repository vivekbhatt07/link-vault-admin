import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TTheme = 'light' | 'dark' | 'system';

const SHADE_KEYS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

type TAccentShades = Record<(typeof SHADE_KEYS)[number], string>;

const ACCENT_SHADES: Record<string, TAccentShades> = {
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
    950: '#500724',
  },
  gray: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },
};

const prefersDark = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const resolveTheme = (theme: TTheme): 'light' | 'dark' =>
  theme === 'system' ? (prefersDark() ? 'dark' : 'light') : theme;

const applyTheme = (theme: TTheme) => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolveTheme(theme));
};

/** Cross-fades the whole page between themes where the browser supports it. */
const applyThemeSmoothly = (theme: TTheme) => {
  const root = window.document.documentElement;
  if (root.classList.contains(resolveTheme(theme))) return;
  if (!document.startViewTransition || prefersReducedMotion()) {
    applyTheme(theme);
    return;
  }
  document.startViewTransition(() => applyTheme(theme));
};

const applyAccentColor = (color: string) => {
  const shades = ACCENT_SHADES[color];
  if (!shades) return;
  const root = window.document.documentElement;
  SHADE_KEYS.forEach((key) => {
    root.style.setProperty(`--accent-${key}`, shades[key]);
  });
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
        applyThemeSmoothly(theme);
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

// Follow the OS setting live while the admin has chosen "System".
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', () => {
    if (useAppearanceStore.getState().theme === 'system') {
      applyThemeSmoothly('system');
    }
  });
