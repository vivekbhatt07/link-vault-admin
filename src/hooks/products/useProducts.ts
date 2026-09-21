import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { productsService } from '@/api/services/products';
import { QUERY_KEYS } from '@/constants/query-key';
import type { ProductListParams } from '@/types/api';

export const useProducts = (params: ProductListParams = {}) =>
  useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(params),
    queryFn: async () => {
      const response = await productsService.list(params);
      return (
        response.data ?? {
          items: [],
          total: 0,
          page: params.page ?? 1,
          limit: params.limit ?? 20,
          hasMore: false,
        }
      );
    },
    placeholderData: keepPreviousData,
  });
