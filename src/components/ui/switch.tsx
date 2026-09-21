import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-slot="switch"
    className={cn(
      'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent outline-none transition-colors',
      'focus-visible:ring-4 focus-visible:ring-cyan-500/25 dark:focus-visible:ring-cyan-400/30',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-stone-200',
      'dark:data-[state=checked]:bg-cyan-500 dark:data-[state=unchecked]:bg-stone-700',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform',
        'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = 'Switch';

export { Switch };
