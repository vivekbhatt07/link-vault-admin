import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { productsService } from '@/api/services/products';
import { QUERY_KEYS } from '@/constants/query-key';
import type { CreateProductPayload } from '@/types/api';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      productsService.create(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
    },
  });
};
