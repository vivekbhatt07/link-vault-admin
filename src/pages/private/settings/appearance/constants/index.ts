import { Laptop, Moon, Sun } from 'lucide-react';
import type { TAccentColor, TThemeOption } from '../types';

export const THEME_OPTIONS: TThemeOption[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Laptop },
];

export const ACCENT_COLORS: TAccentColor[] = [
  { value: 'blue', hex: '#3b82f6' },
  { value: 'purple', hex: '#a855f7' },
  { value: 'green', hex: '#22c55e' },
  { value: 'red', hex: '#ef4444' },
  { value: 'orange', hex: '#f97316' },
  { value: 'yellow', hex: '#eab308' },
  { value: 'pink', hex: '#ec4899' },
  { value: 'gray', hex: '#6b7280' },
];
