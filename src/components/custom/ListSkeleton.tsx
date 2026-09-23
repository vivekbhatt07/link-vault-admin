import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TListSkeletonProps = {
  rows?: number;
  /** Leading media shape: product/category thumbnail or user avatar. */
  media?: 'square' | 'circle' | 'none';
  /** Short trailing blocks, standing in for badges/toggles/actions. */
  trailing?: number;
  /** Render inside the bordered table card used by list pages. */
  bordered?: boolean;
  className?: string;
};

/** Loading placeholder shaped like a table/list, so content doesn't jump in. */
const ListSkeleton = ({
  rows = 6,
  media = 'square',
  trailing = 2,
  bordered = true,
  className,
}: TListSkeletonProps) => (
  <div
    role="status"
    aria-label="Loading"
    className={cn(
      bordered &&
        'overflow-hidden rounded-xl border border-stone-200 bg-white dark:border-stone-700/60 dark:bg-stone-900',
      className,
    )}
  >
    {bordered && (
      <div className="flex h-10 items-center gap-4 border-b border-stone-200 bg-stone-50 px-4 dark:border-stone-700/60 dark:bg-stone-800/50">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="ml-auto h-2.5 w-12" />
        <Skeleton className="h-2.5 w-12" />
      </div>
    )}
    <ul className="divide-y divide-stone-100 dark:divide-stone-800">
      {Array.from({ length: rows }).map((_, index) => (
        <li
          key={index}
          className="flex items-center gap-3 px-4 py-3"
          style={{ opacity: 1 - index * (0.6 / rows) }}
        >
          {media !== 'none' && (
            <Skeleton
              className={cn(
                'size-10 shrink-0',
                media === 'circle' ? 'rounded-full' : 'rounded-md',
              )}
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton
              className="h-3 rounded"
              style={{ width: `${45 + ((index * 17) % 30)}%` }}
            />
            <Skeleton className="h-2.5 w-1/4 rounded" />
          </div>
          {Array.from({ length: trailing }).map((__, trailingIndex) => (
            <Skeleton
              key={trailingIndex}
              className="hidden h-5 w-14 rounded-full sm:block"
            />
          ))}
        </li>
      ))}
    </ul>
  </div>
);

export default ListSkeleton;
