import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/types/api';

import { FILTER_ALL } from '../constants';

type TProductFiltersProps = {
  categories: Category[];
  categoryId: string | undefined;
  isFeatured: boolean | undefined;
  search: string;
  onCategoryChange: (categoryId: string | undefined) => void;
  onFeaturedChange: (isFeatured: boolean | undefined) => void;
  onSearchChange: (search: string) => void;
  onClear: () => void;
};

const FEATURED_OPTIONS = [
  { value: FILTER_ALL, label: 'All products' },
  { value: 'true', label: 'Featured only' },
  { value: 'false', label: 'Not featured' },
] as const;

/**
 * Category and featured filters are server-side. The name search only
 * filters the page already loaded — the backend has no search endpoint.
 */
const ProductFilters = ({
  categories,
  categoryId,
  isFeatured,
  search,
  onCategoryChange,
  onFeaturedChange,
  onSearchChange,
  onClear,
}: TProductFiltersProps) => {
  const hasFilters =
    Boolean(categoryId) || isFeatured !== undefined || search.length > 0;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Filter this page by name…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onClear={() => onSearchChange('')}
          startAdornment={
            <Search className="pointer-events-none size-4 text-stone-400" />
          }
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select
          value={categoryId ?? FILTER_ALL}
          onValueChange={(value) =>
            onCategoryChange(value === FILTER_ALL ? undefined : value)
          }
        >
          <SelectTrigger className="sm:w-52" aria-label="Filter by category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FILTER_ALL}>All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={isFeatured === undefined ? FILTER_ALL : String(isFeatured)}
          onValueChange={(value) =>
            onFeaturedChange(
              value === FILTER_ALL ? undefined : value === 'true',
            )
          }
        >
          <SelectTrigger className="sm:w-44" aria-label="Filter by featured">
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
