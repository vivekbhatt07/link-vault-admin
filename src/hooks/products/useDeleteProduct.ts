import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { productsService } from '@/api/services/products';
import { QUERY_KEYS } from '@/constants/query-key';

/** Hard delete. Also removes every testimonial on the product. */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.remove(id),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TESTIMONIALS.ALL });
    },
  });
};
