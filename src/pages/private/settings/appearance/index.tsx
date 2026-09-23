import { Info } from 'lucide-react';

import { useAppearanceStore } from '@/store/appearanceStore';
import AccentColorSection from './layouts/AccentColorSection';
import ThemeSection from './layouts/ThemeSection';

/** Preferences apply instantly and persist on this device. */
const AppearancePage = () => {
  const { theme, setTheme, accentColor, setAccentColor } = useAppearanceStore();

  return (
    <div className="flex flex-col gap-6">
      <ThemeSection selectedTheme={theme} onThemeChange={setTheme} />
      <AccentColorSection
        selectedAccent={accentColor}
        onAccentChange={setAccentColor}
      />
      <p className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
        <Info className="size-3.5" />
        Changes apply instantly and are saved on this device.
      </p>
    </div>
  );
};

export default AppearancePage;
