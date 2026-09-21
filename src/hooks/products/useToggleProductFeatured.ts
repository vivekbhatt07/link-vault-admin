import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { productsService } from '@/api/services/products';
import { QUERY_KEYS } from '@/constants/query-key';
import type { Paginated, Product, ProductListParams } from '@/types/api';

type TVariables = { id: string; isFeatured: boolean };

const patchLists = (
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  patch: Partial<Product>,
) => {
  queryClient.setQueriesData<Paginated<Product>>(
    { queryKey: QUERY_KEYS.PRODUCTS.LISTS },
    (old) =>
      old
        ? {
            ...old,
            items: old.items.map((product) =>
              product.id === id ? { ...product, ...patch } : product,
            ),
          }
        : old,
  );
};

/**
 * Optimistic toggle across every cached product list, reconciled with the
 * product the backend returns.
 */
export const useToggleProductFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: TVariables) =>
      productsService.update(id, { isFeatured }),

    onMutate: async ({ id, isFeatured }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.PRODUCTS.LISTS });
      const previous = queryClient.getQueriesData<Paginated<Product>>({
        queryKey: QUERY_KEYS.PRODUCTS.LISTS,
      });
      patchLists(queryClient, id, { isFeatured });
      return { previous };
    },

    onError: (_error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSuccess: (response, { id }) => {
      toast.success(response.message);
      const updated = response.data;
      if (updated) {
        patchLists(queryClient, id, updated);
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.PRODUCTS.DETAIL(updated.slug),
        });
      }
      // Lists filtered by isFeatured (and the dashboard featured count)
      // need a real refetch: membership changed, not just a field.
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS.LISTS,
        predicate: (query) => {
          const params = query.queryKey[2] as ProductListParams | undefined;
          return params?.isFeatured !== undefined;
        },
      });
    },
  });
};
