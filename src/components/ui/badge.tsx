import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  [
    'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden',
    'rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap',
    'transition-colors duration-150',
    // focus — cyan ring
    'focus-visible:outline-none focus-visible:border-cyan-500 focus-visible:ring-4 focus-visible:ring-cyan-500/25',
    'dark:focus-visible:border-cyan-400 dark:focus-visible:ring-cyan-400/25',
    'has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
    // invalid
    'aria-invalid:border-red-500 aria-invalid:ring-4 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-400/30',
    '[&>svg]:pointer-events-none [&>svg]:size-3!',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-cyan-600 text-white',
          'dark:bg-cyan-500 dark:text-stone-950',
          '[a]:hover:bg-cyan-500 dark:[a]:hover:bg-cyan-400',
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
          'text-cyan-600 underline-offset-4 hover:underline',
          'dark:text-cyan-400',
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
