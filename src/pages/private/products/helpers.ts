import type { ProductAvailability } from '@/types/api';

import { AVAILABILITY_OPTIONS } from './constants';

export const AVAILABILITY_LABELS = Object.fromEntries(
  AVAILABILITY_OPTIONS.map((option) => [option.value, option.label]),
) as Record<ProductAvailability, string>;

/** Badge variant per availability, shared by the list and detail pages. */
export const availabilityVariant = (availability: ProductAvailability) =>
  ({
    IN_STOCK: 'success',
    OUT_OF_STOCK: 'destructive',
    MADE_TO_ORDER: 'accent',
    COMING_SOON: 'warning',
  })[availability] as 'success' | 'destructive' | 'accent' | 'warning';
