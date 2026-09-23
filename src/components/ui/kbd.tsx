import * as React from 'react';

import { cn } from '@/lib/utils';

/** Keyboard key hint, e.g. <Kbd>Ctrl</Kbd><Kbd>K</Kbd>. */
function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-stone-200 bg-white px-1 font-sans text-[10px] font-medium text-stone-500 shadow-[0_1px_0_0] shadow-stone-200',
        'dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:shadow-stone-700',
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
