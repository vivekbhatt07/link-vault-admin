import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TThemeOption, TTheme } from '../types';

type TThemeOptionButtonProps = TThemeOption & {
  isSelected: boolean;
  onClick: (value: TTheme) => void;
};

const ThemeOptionButton = ({
  value,
  label,
  icon: Icon,
  isSelected,
  onClick,
}: TThemeOptionButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={() => onClick(value)}
      startAdornment={<Icon className="h-6 w-6" />}
      className={cn(
        isSelected
          ? 'border-accent-600 bg-accent-50 text-accent-700 dark:border-accent-400 dark:bg-accent-950/50 dark:text-accent-400'
          : 'text-muted-foreground',
      )}
    >
      {label}
    </Button>
  );
};

export default ThemeOptionButton;
