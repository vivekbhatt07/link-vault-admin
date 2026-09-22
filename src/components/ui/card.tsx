import * as React from 'react';

import { cn } from '@/lib/utils';

function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        'group/card flex flex-col gap-3 overflow-hidden rounded-xl py-3 text-sm',
        'sm:gap-4 sm:py-4',
        'md:gap-5 md:py-5',
        // surface
        'border border-stone-200 bg-white text-stone-900 shadow-sm',
        'dark:border-stone-700/60 dark:bg-stone-900 dark:text-stone-50',
        'transition-shadow duration-150',
        // image rounding
        'has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0',
        '*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        // compact size
        'data-[size=sm]:gap-2 data-[size=sm]:py-2 data-[size=sm]:has-data-[slot=card-footer]:pb-0',
        'sm:data-[size=sm]:gap-3 sm:data-[size=sm]:py-3',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-3',
        'sm:px-4',
        'md:px-6',
        'group-data-[size=sm]/card:px-2 sm:group-data-[size=sm]/card:px-3',
        'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        'has-data-[slot=card-description]:grid-rows-[auto_auto]',
        '[.border-b]:pb-3 sm:[.border-b]:pb-4 md:[.border-b]:pb-5',
        'group-data-[size=sm]/card:[.border-b]:pb-2 sm:group-data-[size=sm]/card:[.border-b]:pb-3',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'font-heading text-base font-semibold leading-snug tracking-tight',
        'text-stone-900 dark:text-stone-50',
        'group-data-[size=sm]/card:text-sm',
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        'text-sm leading-relaxed text-stone-500 dark:text-stone-400',
        className,
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        'px-3',
        'sm:px-4',
        'md:px-6',
        'group-data-[size=sm]/card:px-2 sm:group-data-[size=sm]/card:px-3',
        className,
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center rounded-b-xl border-t border-stone-200/60 bg-stone-50 p-3',
        'sm:p-4',
        'md:p-5',
        'dark:border-stone-700/60 dark:bg-stone-800/50',
        'group-data-[size=sm]/card:p-2 sm:group-data-[size=sm]/card:p-3',
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
