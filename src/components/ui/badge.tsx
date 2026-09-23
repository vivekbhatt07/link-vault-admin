import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  [
    'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden',
    'rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap',
    'transition-colors duration-150',
    // focus — accent ring
    'focus-visible:outline-none focus-visible:border-accent-500 focus-visible:ring-4 focus-visible:ring-accent-500/25',
    'dark:focus-visible:border-accent-400 dark:focus-visible:ring-accent-400/25',
    'has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
    // invalid
    'aria-invalid:border-red-500 aria-invalid:ring-4 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-400/30',
    '[&>svg]:pointer-events-none [&>svg]:size-3!',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-accent-600 text-white',
          'dark:bg-accent-500 dark:text-stone-950',
          '[a]:hover:bg-accent-500 dark:[a]:hover:bg-accent-400',
        ],
        secondary: [
          'bg-stone-100 text-stone-700',
          'dark:bg-stone-800 dark:text-stone-200',
          '[a]:hover:bg-stone-200 dark:[a]:hover:bg-stone-700',
        ],
        destructive: [
          'bg-red-100 text-red-700',
          'dark:bg-red-900/30 dark:text-red-400',
          'focus-visible:ring-red-500/20 dark:focus-visible:ring-red-400/30',
          '[a]:hover:bg-red-200 dark:[a]:hover:bg-red-900/50',
        ],
        success: [
          'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15',
          'dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-400/20',
        ],
        warning: [
          'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
          'dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-400/20',
        ],
        accent: [
          'bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-600/15',
          'dark:bg-accent-950/50 dark:text-accent-300 dark:ring-accent-400/20',
        ],
        outline: [
          'border-stone-200 text-stone-700',
          'dark:border-stone-700 dark:text-stone-300',
          '[a]:hover:bg-stone-100 [a]:hover:text-stone-500',
          'dark:[a]:hover:bg-stone-800 dark:[a]:hover:text-stone-400',
        ],
        ghost: [
          'hover:bg-stone-100 hover:text-stone-700',
          'dark:hover:bg-stone-800 dark:hover:text-stone-300',
        ],
        link: [
          'text-accent-600 underline-offset-4 hover:underline',
          'dark:text-accent-400',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
