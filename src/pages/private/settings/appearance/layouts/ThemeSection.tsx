import { SunMoon } from 'lucide-react';

import SettingsSection from '../../components/SettingsSection';
import ThemeOptionButton from '../components/ThemeOptionButton';
import { THEME_OPTIONS } from '../constants';
import type { TTheme } from '../types';

type TThemeSectionProps = {
  selectedTheme: TTheme;
  onThemeChange: (value: TTheme) => void;
};

const ThemeSection = ({ selectedTheme, onThemeChange }: TThemeSectionProps) => (
  <SettingsSection
    icon={<SunMoon />}
    title="Theme"
    description="Choose how the admin panel looks for you. System follows your device."
  >
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {THEME_OPTIONS.map((option) => (
        <ThemeOptionButton
          key={option.value}
          {...option}
          isSelected={selectedTheme === option.value}
          onClick={onThemeChange}
        />
      ))}
    </div>
  </SettingsSection>
);

export default ThemeSection;
