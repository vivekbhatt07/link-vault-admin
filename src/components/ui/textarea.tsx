import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        'w-full rounded-lg border border-stone-200 bg-transparent px-3 py-2 text-sm outline-none transition-colors resize-none',
        'placeholder:text-stone-400 dark:placeholder:text-stone-500',
        'focus-visible:border-cyan-500 dark:focus-visible:border-cyan-400',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-stone-100 disabled:opacity-50',
        'aria-invalid:border-red-500',
        'dark:border-stone-700 dark:bg-stone-800/30',
        'dark:disabled:bg-stone-800/80',
        'dark:aria-invalid:border-red-500/70',
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
