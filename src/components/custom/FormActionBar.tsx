import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TFormActionBarProps = {
  isDirty: boolean;
  isPending: boolean;
  submitLabel: string;
  /** Secondary button (Cancel / Reset). Omit to hide it. */
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Disable the secondary button while the form is clean (Reset semantics). */
  secondaryRequiresDirty?: boolean;
  /** Allow submitting a clean form (e.g. a create form with defaults). */
  allowCleanSubmit?: boolean;
  className?: string;
};

/**
 * Floating save bar that sticks to the bottom of the scroll area, so the
 * primary action is always reachable on long forms and the dirty state is
 * visible at a glance. Must be rendered inside the <form>.
 */
const FormActionBar = ({
  isDirty,
  isPending,
  submitLabel,
  secondaryLabel,
  onSecondary,
  secondaryRequiresDirty = false,
  allowCleanSubmit = false,
  className,
}: TFormActionBarProps) => (
  <div
    className={cn(
      'sticky bottom-0 z-20 -mx-1 mt-2 flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 sm:px-4',
      'bg-white/85 shadow-lg shadow-stone-950/5 supports-backdrop-filter:backdrop-blur-md',
      'dark:bg-stone-900/85 dark:shadow-black/30',
      'transition-colors duration-200',
      isDirty
        ? 'border-accent-200 dark:border-accent-900/70'
        : 'border-stone-200 dark:border-stone-700/60',
      className,
    )}
  >
    <p
      aria-live="polite"
      className="flex min-w-0 items-center gap-2 text-xs text-stone-500 dark:text-stone-400"
    >
      <span className="relative flex size-2 shrink-0">
        {isDirty && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-60" />
        )}
        <span
          className={cn(
            'relative inline-flex size-2 rounded-full transition-colors',
            isDirty ? 'bg-amber-500' : 'bg-emerald-500',
          )}
        />
      </span>
      <span className="truncate">
        {isDirty ? 'Unsaved changes' : 'No unsaved changes'}
      </span>
    </p>

    <div className="flex shrink-0 items-center gap-2">
      {secondaryLabel && onSecondary && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onSecondary}
          disabled={isPending || (secondaryRequiresDirty && !isDirty)}
        >
          {secondaryLabel}
        </Button>
      )}
      <Button
        type="submit"
        size="sm"
        disabled={isPending || (!allowCleanSubmit && !isDirty)}
        startAdornment={
          isPending ? <Loader2 className="animate-spin" /> : undefined
        }
      >
        {submitLabel}
      </Button>
    </div>
  </div>
);

export default FormActionBar;
