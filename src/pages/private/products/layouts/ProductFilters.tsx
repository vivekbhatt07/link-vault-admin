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
  { value: FILTER_ALL, label: 'All products' },
  { value: 'true', label: 'Featured only' },
  { value: 'false', label: 'Not featured' },
] as const;

const BESTSELLER_OPTIONS = [
  { value: FILTER_ALL, label: 'All products' },
  { value: 'true', label: 'Bestsellers only' },
  { value: 'false', label: 'Not bestsellers' },
] as const;

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
  const hasFilters =
    Boolean(categoryId) ||
    isFeatured !== undefined ||
    isBestseller !== undefined ||
    Boolean(availability) ||
    search.length > 0;

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
          <SelectTrigger className="w-40" aria-label="Filter by featured">
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
          <SelectTrigger className="w-44" aria-label="Filter by bestseller">
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
          <SelectTrigger className="w-44" aria-label="Filter by availability">
            <SelectValue placeholder="All availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FILTER_ALL}>All availability</SelectItem>
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
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
