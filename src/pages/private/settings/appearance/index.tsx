import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppearanceStore } from '@/store/appearanceStore';
import type { TTheme } from './types';
import ThemeSection from './layouts/ThemeSection';
import AccentColorSection from './layouts/AccentColorSection';

const AppearancePage = () => {
  const { theme, setTheme, accentColor, setAccentColor } = useAppearanceStore();

  const [pendingTheme, setPendingTheme] = useState<TTheme>(theme);
  const [pendingAccent, setPendingAccent] = useState<string>(accentColor);

  const handleSave = () => {
    setTheme(pendingTheme);
    setAccentColor(pendingAccent);
  };

  return (
    <div className="flex flex-col gap-8">
      <ThemeSection
        selectedTheme={pendingTheme}
        onThemeChange={setPendingTheme}
      />
      <AccentColorSection
        selectedAccent={pendingAccent}
        onAccentChange={setPendingAccent}
      />
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save preferences</Button>
      </div>
    </div>
  );
};

export default AppearancePage;
