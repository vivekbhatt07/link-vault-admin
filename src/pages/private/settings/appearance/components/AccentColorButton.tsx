import { Check } from 'lucide-react';

import { SimpleTooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { TAccentColor } from '../types';

type TAccentColorButtonProps = TAccentColor & {
  isSelected: boolean;
  onClick: (value: string) => void;
};

const toLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const AccentColorButton = ({
  value,
  hex,
  isSelected,
  onClick,
}: TAccentColorButtonProps) => (
  <SimpleTooltip label={toLabel(value)}>
    <button
      type="button"
      aria-label={`${toLabel(value)} accent`}
      aria-pressed={isSelected}
      onClick={() => onClick(value)}
      className={cn(
        'flex size-9 cursor-pointer items-center justify-center rounded-full shadow-sm outline-none',
        'ring-offset-2 ring-offset-white transition-all duration-200 dark:ring-offset-stone-900',
        'hover:scale-110 focus-visible:ring-2 active:scale-95',
        isSelected ? 'scale-110 ring-2' : 'ring-0',
      )}
      style={{ backgroundColor: hex, ['--tw-ring-color' as string]: hex }}
    >
      <Check
        className={cn(
          'size-4 text-white drop-shadow transition-all duration-200',
          isSelected ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
        )}
        strokeWidth={3}
      />
    </button>
  </SimpleTooltip>
);

export default AccentColorButton;
