import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const loaderVariants = cva(
  // base — spinning ring
  'animate-spin rounded-full border-4 shrink-0',
  {
    variants: {
      /**
       * `default`  — accent colour on a muted track (matches the app's primary colour)
       * `muted`    — subtle stone track + stone accent (use inside cards / forms)
       * `white`    — white ring, transparent track (use on dark / coloured backgrounds)
       */
      variant: {
        default:
          'border-stone-200 border-t-accent-500 dark:border-stone-700 dark:border-t-accent-400',
        muted:
          'border-stone-200 border-t-stone-500 dark:border-stone-700 dark:border-t-stone-300',
        white: 'border-white/30 border-t-white',
      },
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface LoaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  /** Accessible label read by screen-readers. Defaults to "Loading…" */
  label?: string;
  /**
   * When `true` the loader is centred inside a full-width flex container.
   * Handy for page-level / section-level loading states.
   */
  centered?: boolean;
  /**
   * Custom width — overrides the `size` variant.
   * Accepts any valid CSS value (e.g. `32`, `"2rem"`, `"10%"`).
   * Numbers are treated as pixels.
   */
  width?: string | number;
  /**
   * Custom height — overrides the `size` variant.
   * Accepts any valid CSS value (e.g. `32`, `"2rem"`, `"10%"`).
   * Numbers are treated as pixels.
   */
  height?: string | number;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      className,
      variant,
      size,
      label = 'Loading…',
      centered = false,
      width,
      height,
      style,
      ...props
    },
    ref,
  ) => {
    const customStyle: React.CSSProperties = {
      ...(width !== undefined && {
        width: typeof width === 'number' ? `${width}px` : width,
      }),
      ...(height !== undefined && {
        height: typeof height === 'number' ? `${height}px` : height,
      }),
      ...style,
    };
    const spinner = (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(loaderVariants({ variant, size }), className)}
        style={customStyle}
        {...props}
      />
    );

    if (centered) {
      return (
        <div className="flex w-full items-center justify-center">{spinner}</div>
      );
    }

    return spinner;
  },
);
Loader.displayName = 'Loader';

export { Loader, loaderVariants };
