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
      'flex flex-col items-center justify-center gap-3 py-16 text-center',
      className,
    )}
  >
    <div className="flex size-12 items-center justify-center rounded-full bg-stone-100 text-stone-400 dark:bg-stone-800">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-stone-900 dark:text-stone-50">
        {title}
      </p>
      {description && (
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);

export default EmptyState;
