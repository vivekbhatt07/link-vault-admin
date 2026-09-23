import * as React from 'react';

import { cn } from '@/lib/utils';

/** Placeholder block with a soft shimmer sweep. */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-md bg-stone-200/70 dark:bg-stone-800',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer',
        'after:bg-linear-to-r after:from-transparent after:via-white/70 after:to-transparent',
        'dark:after:via-white/5',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
