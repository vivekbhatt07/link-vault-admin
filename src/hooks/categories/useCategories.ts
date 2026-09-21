import { useQuery } from '@tanstack/react-query';

import { categoriesService } from '@/api/services/categories';
import { QUERY_KEYS } from '@/constants/query-key';

/** Cached for 5 minutes — the list is small and read on many pages. */
export const useCategories = () =>
  useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST,
    queryFn: async () => (await categoriesService.list()).data ?? [],
    staleTime: 5 * 60 * 1000,
  });
