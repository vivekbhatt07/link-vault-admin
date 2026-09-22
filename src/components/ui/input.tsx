import * as React from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, startAdornment, endAdornment, onClear, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const hasValue = Boolean(props.value);

    const clearButton =
      hasValue && onClear ? (
        <button
          type="button"
          tabIndex={-1}
          onClick={onClear}
          className="flex items-center justify-center text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors focus:outline-none cursor-pointer"
          aria-label="Clear"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null;

    const resolvedEndAdornment =
      endAdornment ??
      (isPassword ? (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="flex items-center justify-center text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors focus:outline-none cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      ) : (
        clearButton
      ));

    return (
      <div className="relative flex items-center w-full">
        {startAdornment && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            {startAdornment}
          </div>
        )}
        <input
          type={inputType}
          ref={ref}
          data-slot="input"
          className={cn(
            // base
            'h-9 w-full min-w-0 rounded-lg border border-stone-200 bg-transparent px-3 py-2 text-sm outline-none transition-colors md:h-10',
            // placeholder
            'placeholder:text-stone-400 dark:placeholder:text-stone-500',
            // file input
            'file:inline-flex file:h-7 file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-stone-900 dark:file:text-stone-50',
            // focus
            'focus-visible:border-accent-500',
            'dark:focus-visible:border-accent-400',
            // disabled
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-stone-100 disabled:opacity-50',
            // invalid
            'aria-invalid:border-red-500',
            // dark base
            'dark:border-stone-700 dark:bg-stone-800/30',
            'dark:disabled:bg-stone-800/80',
            'dark:aria-invalid:border-red-500/70',
            // adornment padding
            startAdornment && 'pl-9',
            resolvedEndAdornment && 'pr-9',
            className,
          )}
          {...props}
        />
        {resolvedEndAdornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {resolvedEndAdornment}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
