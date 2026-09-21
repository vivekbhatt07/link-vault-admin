export type { TTheme } from '@/store/appearanceStore';

import type { TTheme } from '@/store/appearanceStore';

export type TThemeOption = {
  value: TTheme;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type TAccentColor = {
  value: string;
  hex: string;
};
