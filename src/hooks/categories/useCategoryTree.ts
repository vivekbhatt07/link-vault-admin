import { useQuery } from '@tanstack/react-query';

import { categoriesService } from '@/api/services/categories';
import { QUERY_KEYS } from '@/constants/query-key';
import type { CategoryTreeParams } from '@/types/api';

/** Full nested tree, roots first, children sorted. Cached briefly. */
export const useCategoryTree = (params: CategoryTreeParams = {}) =>
  useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.TREE(params),
    queryFn: async () => (await categoriesService.tree(params)).data ?? [],
    staleTime: 5 * 60 * 1000,
  });
