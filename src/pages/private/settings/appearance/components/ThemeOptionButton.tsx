import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { TThemeOption, TTheme } from '../types';

type TThemeOptionButtonProps = TThemeOption & {
  isSelected: boolean;
  onClick: (value: TTheme) => void;
};

/** Miniature window used as the theme's thumbnail. */
const MiniWindow = ({ dark }: { dark: boolean }) => (
  <div
    className={cn(
      'flex h-full w-full flex-col gap-1.5 p-2.5',
      dark ? 'bg-stone-900' : 'bg-white',
    )}
  >
    <div className="flex gap-1">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className={cn(
            'size-1.5 rounded-full',
            dark ? 'bg-stone-700' : 'bg-stone-200',
          )}
        />
      ))}
    </div>
    <div className="flex flex-1 gap-1.5">
      <div
        className={cn(
          'w-1/4 rounded-sm',
          dark ? 'bg-stone-800' : 'bg-stone-100',
        )}
      />
      <div className="flex flex-1 flex-col gap-1">
        <span className="h-1.5 w-3/4 rounded-full bg-accent-500" />
        <span
          className={cn(
            'h-1.5 w-full rounded-full',
            dark ? 'bg-stone-700' : 'bg-stone-200',
          )}
        />
        <span
          className={cn(
            'h-1.5 w-2/3 rounded-full',
            dark ? 'bg-stone-700' : 'bg-stone-200',
          )}
        />
      </div>
    </div>
  </div>
);

const ThemeOptionButton = ({
  value,
  label,
  icon: Icon,
  isSelected,
  onClick,
}: TThemeOptionButtonProps) => (
  <button
    type="button"
    onClick={() => onClick(value)}
    aria-pressed={isSelected}
    className="group flex cursor-pointer flex-col gap-2 rounded-xl text-left outline-none"
  >
    <div
      className={cn(
        'relative aspect-4/3 w-full overflow-hidden rounded-xl border-2 shadow-sm transition-all duration-200',
        'group-hover:-translate-y-0.5 group-hover:shadow-md group-focus-visible:ring-4 group-focus-visible:ring-accent-500/25',
        isSelected
          ? 'border-accent-500 dark:border-accent-400'
          : 'border-stone-200 group-hover:border-stone-300 dark:border-stone-700 dark:group-hover:border-stone-600',
      )}
    >
      {value === 'system' ? (
        <div className="relative h-full w-full">
          <MiniWindow dark={false} />
          <div className="absolute inset-0 [clip-path:polygon(100%_0,100%_100%,0_100%)]">
            <MiniWindow dark />
          </div>
        </div>
      ) : (
        <MiniWindow dark={value === 'dark'} />
      )}
      <span
        className={cn(
          'absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-accent-500 text-white shadow transition-all duration-200',
          isSelected ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
    </div>
    <span
      className={cn(
        'flex items-center gap-1.5 px-0.5 text-sm font-medium transition-colors',
        isSelected
          ? 'text-stone-900 dark:text-stone-50'
          : 'text-stone-500 dark:text-stone-400',
      )}
    >
      <Icon className="size-4" />
      {label}
    </span>
  </button>
);

export default ThemeOptionButton;
