import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
    'transition-all duration-150 select-none cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-500/25 dark:focus-visible:ring-accent-400/30',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-accent-600 text-white shadow-sm hover:bg-accent-500 active:scale-[0.98] active:bg-accent-700',
          'dark:bg-accent-500 dark:text-white dark:hover:bg-accent-400 dark:active:bg-accent-600',
        ],
        destructive: [
          'bg-red-600 text-white shadow-sm hover:bg-red-500 active:scale-[0.98] active:bg-red-700',
          'dark:bg-red-500 dark:text-white dark:hover:bg-red-400 dark:active:bg-red-600',
          'focus-visible:ring-red-500/25',
        ],
        outline: [
          'border border-stone-200 bg-white text-stone-700 shadow-xs',
          'hover:bg-stone-50 hover:text-stone-900 active:bg-stone-100',
          'dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300',
          'dark:hover:bg-stone-900 dark:hover:text-stone-50 dark:active:bg-stone-800',
        ],
        secondary: [
          'bg-stone-100 text-stone-700 shadow-xs',
          'hover:bg-stone-200 active:bg-stone-300',
          'dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 dark:active:bg-stone-600',
        ],
        ghost: [
          'text-stone-700 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200',
          'dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50 dark:active:bg-stone-700',
        ],
        link: [
          'text-accent-600 underline-offset-4 hover:underline',
          'dark:text-accent-400',
        ],
      },
      size: {
        default: 'h-9 px-4 py-2 md:h-10',
        sm: 'h-8 rounded-md px-3 text-xs md:h-9',
        lg: 'h-10 rounded-md px-6 text-base md:h-11 md:px-8',
        'icon-sm': 'h-7 w-7 md:h-8 md:w-8',
        icon: 'h-8 w-8 md:h-9 md:w-9',
        'icon-lg': 'h-9 w-9 md:h-10 md:w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      startAdornment,
      endAdornment,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {startAdornment}
        <Slottable>{children}</Slottable>
        {endAdornment}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

const iconSizeMap = {
  sm: 'icon-sm',
  default: 'icon',
  lg: 'icon-lg',
} as const satisfies Record<
  string,
  VariantProps<typeof buttonVariants>['size']
>;

export interface IconButtonProps extends Omit<
  ButtonProps,
  'size' | 'startAdornment' | 'endAdornment'
> {
  size?: keyof typeof iconSizeMap;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'default', ...props }, ref) => (
    <Button ref={ref} variant={variant} size={iconSizeMap[size]} {...props} />
  ),
);
IconButton.displayName = 'IconButton';

export { Button, IconButton, buttonVariants };
