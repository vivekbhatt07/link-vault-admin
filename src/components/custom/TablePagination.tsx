import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TTablePaginationProps = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
};

type TPageItem = number | 'gap-start' | 'gap-end';

/** 1 … 4 5 [6] 7 8 … 20 — always shows first/last and two neighbours. */
const getPageItems = (page: number, totalPages: number): TPageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  const items: TPageItem[] = [1];
  if (start > 2) items.push('gap-start');
  for (let current = start; current <= end; current += 1) items.push(current);
  if (end < totalPages - 1) items.push('gap-end');
  items.push(totalPages);
  return items;
};

const TablePagination = ({
  page,
  limit,
  total,
  hasMore,
  isFetching,
  onPageChange,
}: TTablePaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 text-xs text-stone-500 sm:flex-row dark:text-stone-400">
      <span className="flex items-center gap-2 tabular-nums">
        Showing{' '}
        <span className="font-medium text-stone-700 dark:text-stone-200">
          {from}–{to}
        </span>{' '}
        of{' '}
        <span className="font-medium text-stone-700 dark:text-stone-200">
          {total}
        </span>
        {isFetching && (
          <Loader2
            className="size-3.5 animate-spin text-accent-500"
            aria-label="Loading"
          />
        )}
      </span>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isFetching}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </Button>

          {getPageItems(page, totalPages).map((item) =>
            typeof item === 'number' ? (
              <Button
                key={item}
                variant={item === page ? 'default' : 'ghost'}
                size="icon-sm"
                onClick={() => onPageChange(item)}
                disabled={isFetching && item !== page}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={cn(
                  'hidden w-auto min-w-7 px-2 text-xs tabular-nums sm:inline-flex md:w-auto md:min-w-8',
                  item === page && 'pointer-events-none inline-flex',
                )}
              >
                {item}
              </Button>
            ) : (
              <span
                key={item}
                aria-hidden
                className="hidden w-6 text-center sm:inline"
              >
                …
              </span>
            ),
          )}

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasMore || isFetching}
            aria-label="Next page"
          >
            <ChevronRight />
          </Button>
        </nav>
      )}
    </div>
  );
};

export default TablePagination;
