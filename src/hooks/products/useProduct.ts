import { useQuery } from '@tanstack/react-query';

import { productsService } from '@/api/services/products';
import { QUERY_KEYS } from '@/constants/query-key';

/** Includes `avgRating` and `testimonialCount`. Always includes inactive products. */
export const useProduct = (slug: string | undefined) =>
  useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.DETAIL(slug ?? ''),
    queryFn: async () => {
      const response = await productsService.getBySlug(slug!, true);
      if (!response.data) throw new Error(response.message);
      return response.data;
    },
    enabled: Boolean(slug),
    // The page renders its own not-found state.
    meta: { silent: true },
  });
