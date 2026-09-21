import type { ReactNode, CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DropdownItemProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onClick: () => void;
  /** Optional element rendered before the icon (e.g. a color dot) */
  prefix?: ReactNode;
  /** When the icon color comes from a dynamic value rather than a className */
  iconStyle?: CSSProperties;
}

const DropdownItem = ({
  icon: Icon,
  label,
  selected,
  onClick,
  prefix,
  iconStyle,
}: DropdownItemProps) => (
  <Button
    type="button"
    variant="ghost"
    onClick={onClick}
    className={cn(
      'w-full justify-start gap-2.5 px-2.5 h-auto py-2 font-normal',
      selected
        ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-50'
        : 'text-stone-700 dark:text-stone-300',
    )}
  >
    {prefix}
    <Icon
      size={14}
      style={iconStyle}
      className={cn(
        'shrink-0 size-3.5',
        !iconStyle && 'text-stone-500 dark:text-stone-400',
      )}
    />
    <span className="flex-1 text-left">{label}</span>
    {selected && (
      <Check className="shrink-0 text-cyan-600 dark:text-cyan-400 size-[13px]" />
    )}
  </Button>
);

export { DropdownItem };
export type { DropdownItemProps };
