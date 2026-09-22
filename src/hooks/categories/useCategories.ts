import { useQuery } from '@tanstack/react-query';

import { categoriesService } from '@/api/services/categories';
import { QUERY_KEYS } from '@/constants/query-key';
import type { CategoryListParams } from '@/types/api';

/** Flat list, sorted by sortOrder then name. Cached briefly — read on many pages. */
export const useCategories = (params: CategoryListParams = {}) =>
  useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST(params),
    queryFn: async () => (await categoriesService.list(params)).data ?? [],
    staleTime: 5 * 60 * 1000,
  });
