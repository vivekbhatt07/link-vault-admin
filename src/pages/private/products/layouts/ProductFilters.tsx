import { Search, X } from 'lucide-react';

import CategoryTreePicker from '@/components/custom/CategoryTreePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ProductAvailability, ProductSort } from '@/types/api';

import { AVAILABILITY_OPTIONS, FILTER_ALL, SORT_OPTIONS } from '../constants';

type TProductFiltersProps = {
  categoryId: string | undefined;
  isFeatured: boolean | undefined;
  isBestseller: boolean | undefined;
  availability: ProductAvailability | undefined;
  sort: ProductSort;
  search: string;
  onCategoryChange: (categoryId: string | undefined) => void;
  onFeaturedChange: (isFeatured: boolean | undefined) => void;
  onBestsellerChange: (isBestseller: boolean | undefined) => void;
  onAvailabilityChange: (availability: ProductAvailability | undefined) => void;
  onSortChange: (sort: ProductSort) => void;
  onSearchChange: (search: string) => void;
  onClear: () => void;
};

const FEATURED_OPTIONS = [
  { value: FILTER_ALL, label: 'Any' },
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
] as const;

const BESTSELLER_OPTIONS = [
  { value: FILTER_ALL, label: 'Any' },
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
] as const;

/** Muted prefix inside a filter trigger: "Featured: Any". */
const FilterLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="shrink-0 text-stone-400 dark:text-stone-500">
    {children}:
  </span>
);

/** Accent outline marking a select whose filter is currently applied. */
const activeFilterClass =
  'border-accent-300 bg-accent-50/60 text-accent-800 dark:border-accent-800 dark:bg-accent-950/30 dark:text-accent-200';

/** Every filter here (incl. search) is a server-side query param. */
const ProductFilters = ({
  categoryId,
  isFeatured,
  isBestseller,
  availability,
  sort,
  search,
  onCategoryChange,
  onFeaturedChange,
  onBestsellerChange,
  onAvailabilityChange,
  onSortChange,
  onSearchChange,
  onClear,
}: TProductFiltersProps) => {
  const activeFilterCount = [
    Boolean(categoryId),
    isFeatured !== undefined,
    isBestseller !== undefined,
    Boolean(availability),
    search.length > 0,
  ].filter(Boolean).length;
  const hasFilters = activeFilterCount > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by name, SKU, or tag…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            onClear={() => onSearchChange('')}
            startAdornment={
              <Search className="pointer-events-none size-4 text-stone-400" />
            }
          />
        </div>

        <div className="sm:w-56">
          <CategoryTreePicker
            value={categoryId ?? null}
            onChange={(id) => onCategoryChange(id ?? undefined)}
            allowNone
            noneLabel="All categories"
            placeholder="All categories"
          />
        </div>

        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as ProductSort)}
        >
          <SelectTrigger className="sm:w-44" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={isFeatured === undefined ? FILTER_ALL : String(isFeatured)}
          onValueChange={(value) =>
            onFeaturedChange(
              value === FILTER_ALL ? undefined : value === 'true',
            )
          }
        >
          <SelectTrigger
            className={cn(
              'w-auto min-w-36',
              isFeatured !== undefined && activeFilterClass,
            )}
            aria-label="Filter by featured"
          >
            <FilterLabel>Featured</FilterLabel>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FEATURED_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={isBestseller === undefined ? FILTER_ALL : String(isBestseller)}
          onValueChange={(value) =>
            onBestsellerChange(
              value === FILTER_ALL ? undefined : value === 'true',
            )
          }
        >
          <SelectTrigger
            className={cn(
              'w-auto min-w-36',
              isBestseller !== undefined && activeFilterClass,
            )}
            aria-label="Filter by bestseller"
          >
            <FilterLabel>Bestseller</FilterLabel>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BESTSELLER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={availability ?? FILTER_ALL}
          onValueChange={(value) =>
            onAvailabilityChange(
              value === FILTER_ALL ? undefined : (value as ProductAvailability),
            )
          }
        >
          <SelectTrigger
            className={cn('w-auto min-w-44', availability && activeFilterClass)}
            aria-label="Filter by availability"
          >
            <FilterLabel>Availability</FilterLabel>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FILTER_ALL}>All</SelectItem>
            {AVAILABILITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            startAdornment={<X />}
            className="animate-in text-stone-500 fade-in-0 slide-in-from-left-1"
          >
            Clear filters
            <span className="rounded-full bg-stone-200 px-1.5 text-[10px] font-semibold tabular-nums text-stone-700 dark:bg-stone-700 dark:text-stone-200">
              {activeFilterCount}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
