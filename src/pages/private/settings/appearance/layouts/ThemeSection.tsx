import { THEME_OPTIONS } from '../constants';
import ThemeOptionButton from '../components/ThemeOptionButton';
import type { TTheme } from '../types';

type TThemeSectionProps = {
  selectedTheme: TTheme;
  onThemeChange: (value: TTheme) => void;
};

const ThemeSection = ({ selectedTheme, onThemeChange }: TThemeSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Choose how LinkVault looks for you.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {THEME_OPTIONS.map((option) => (
          <ThemeOptionButton
            key={option.value}
            {...option}
            isSelected={selectedTheme === option.value}
            onClick={onThemeChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSection;
