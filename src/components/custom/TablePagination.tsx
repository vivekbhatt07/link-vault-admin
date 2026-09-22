import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type TTablePaginationProps = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
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
    <div className="flex items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
      <span>
        Showing {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-2">
        <span className="tabular-nums">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isFetching}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasMore || isFetching}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
