import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PopoverTrigger } from '@/components/ui/popover';

interface DropdownTriggerProps {
  open: boolean;
  children: ReactNode;
  className?: string;
}

const DropdownTrigger = ({
  open,
  children,
  className,
}: DropdownTriggerProps) => (
  <PopoverTrigger asChild>
    <Button
      type="button"
      role="combobox"
      aria-expanded={open}
      variant="outline"
      endAdornment={
        <ChevronDown
          className={cn(
            'shrink-0 text-stone-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      }
      className={cn(
        'flex-1 justify-between rounded-lg px-3 bg-transparent shadow-none font-normal',
        'hover:border-stone-300 hover:bg-transparent dark:hover:border-stone-600 dark:hover:bg-stone-800/30',
        'focus-visible:border-accent-500 focus-visible:ring-0 dark:focus-visible:border-accent-400',
        open && 'border-accent-500 dark:border-accent-400',
        'dark:border-stone-700 dark:bg-stone-800/30',
        className,
      )}
    >
      <span className="flex items-center gap-2 flex-1 min-w-0 truncate">
        {children}
      </span>
    </Button>
  </PopoverTrigger>
);

export { DropdownTrigger };
export type { DropdownTriggerProps };
