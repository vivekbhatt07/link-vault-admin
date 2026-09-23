import * as React from 'react';

import { cn } from '@/lib/utils';

/** text-sm line height (1.25rem) × rows, plus vertical padding and border. */
const minHeightForRows = (rows: number) => `calc(${rows} * 1.25rem + 1.125rem)`;

/**
 * Grows with its content where `field-sizing` is supported; `rows` stays the
 * minimum height so empty fields keep their intended size.
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, rows, style, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      rows={rows}
      style={{
        ...(rows !== undefined && { minHeight: minHeightForRows(rows) }),
        ...style,
      }}
      className={cn(
        'w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none resize-none',
        'field-sizing-content max-h-96',
        'transition-[border-color,box-shadow] duration-150',
        'hover:border-stone-300 dark:hover:border-stone-600',
        'placeholder:text-stone-400 dark:placeholder:text-stone-500',
        'focus-visible:border-accent-500 focus-visible:ring-4 focus-visible:ring-accent-500/15',
        'dark:focus-visible:border-accent-400 dark:focus-visible:ring-accent-400/15',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-stone-100 disabled:opacity-50',
        'aria-invalid:border-red-500 aria-invalid:focus-visible:ring-red-500/15',
        'dark:border-stone-700 dark:bg-stone-900/60',
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
