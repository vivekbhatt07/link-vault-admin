import { useSearchParams } from 'react-router';
import { Search, Users, X } from 'lucide-react';

import EmptyState from '@/components/custom/EmptyState';
import ListSkeleton from '@/components/custom/ListSkeleton';
import PageHeader from '@/components/custom/PageHeader';
import TablePagination from '@/components/custom/TablePagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useUsers } from '@/hooks/users';
import { cn } from '@/lib/utils';
import type { Role } from '@/types/api';

import {
  CUSTOMER_LIST_LIMIT,
  CUSTOMER_LIST_SEARCH_PARAMS,
  FILTER_ALL,
} from './constants';
import CustomersTable from './layouts/CustomersTable';

const { PAGE, ROLE, SEARCH } = CUSTOMER_LIST_SEARCH_PARAMS;

const CustomersPage = () => {
  useDocumentTitle('Customers');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get(PAGE)) || 1);
  const role = (searchParams.get(ROLE) as Role | null) ?? undefined;
  const search = searchParams.get(SEARCH) ?? '';
  const debouncedSearch = useDebouncedValue(search, 400);

  const users = useUsers({
    page,
    limit: CUSTOMER_LIST_LIMIT,
    role,
    search: debouncedSearch || undefined,
  });

  const items = users.data?.items ?? [];
  const hasFilters = Boolean(role) || search.length > 0;

  const updateParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined) next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next);
  };

  const setFilter = (key: string, value: string | undefined) =>
    updateParams({ [key]: value, [PAGE]: undefined });

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Customers"
        count={users.data?.total}
        description="Read-only. There is no edit, delete, or role-change action here."
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(event) =>
              setFilter(SEARCH, event.target.value || undefined)
            }
            onClear={() => setFilter(SEARCH, undefined)}
            startAdornment={
              <Search className="pointer-events-none size-4 text-stone-400" />
            }
          />
        </div>

        <Select
          value={role ?? FILTER_ALL}
          onValueChange={(value) =>
            setFilter(ROLE, value === FILTER_ALL ? undefined : value)
          }
        >
          <SelectTrigger
            className={cn(
              'sm:w-40',
              role &&
                'border-accent-300 bg-accent-50/60 text-accent-800 dark:border-accent-800 dark:bg-accent-950/30 dark:text-accent-200',
            )}
            aria-label="Filter by role"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FILTER_ALL}>All roles</SelectItem>
            <SelectItem value="USER">Customer</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {users.isPending ? (
        <ListSkeleton rows={8} media="circle" trailing={2} />
      ) : items.length > 0 ? (
        <div
          aria-busy={users.isPlaceholderData}
          className={cn(
            'flex flex-col gap-4 transition-opacity duration-200',
            users.isPlaceholderData && 'pointer-events-none opacity-60',
          )}
        >
          <CustomersTable users={items} />
          <TablePagination
            page={users.data?.page ?? page}
            limit={users.data?.limit ?? CUSTOMER_LIST_LIMIT}
            total={users.data?.total ?? 0}
            hasMore={users.data?.hasMore ?? false}
            isFetching={users.isFetching}
            onPageChange={(next) =>
              updateParams({ [PAGE]: next > 1 ? String(next) : undefined })
            }
          />
        </div>
      ) : (
        <EmptyState
          icon={<Users className="size-5" />}
          title={hasFilters ? 'No customers match' : 'No customers yet'}
          description={
            hasFilters
              ? 'Try a different search or role filter.'
              : 'Customers will appear here once they sign up.'
          }
          action={
            hasFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchParams(new URLSearchParams())}
              >
                <X />
                Clear filters
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
};

export default CustomersPage;
