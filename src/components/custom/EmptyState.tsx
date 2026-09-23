import { cn } from '@/lib/utils';

type TEmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: TEmptyStateProps) => (
  <div
    className={cn(
      'flex animate-fade-up flex-col items-center justify-center gap-4 py-16 text-center',
      className,
    )}
  >
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-3 rounded-full bg-accent-500/10 blur-xl dark:bg-accent-400/10"
      />
      <div className="relative flex size-12 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-400 shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-500">
        {icon}
      </div>
    </div>
    <div className="max-w-sm">
      <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">
        {title}
      </p>
      {description && (
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);

export default EmptyState;
