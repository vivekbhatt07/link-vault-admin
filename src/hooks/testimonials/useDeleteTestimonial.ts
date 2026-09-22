import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { testimonialsService } from '@/api/services/testimonials';
import { QUERY_KEYS } from '@/constants/query-key';

type TVariables = { id: string; productId: string; productSlug: string };

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: TVariables) => testimonialsService.remove(id),
    onSuccess: (response, { productSlug }) => {
      toast.success(response.message);
      // Prefix match: also covers the per-product LIST and the global ALL_LIST.
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TESTIMONIALS.ALL });
      // avgRating / testimonialCount live on the product detail.
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS.DETAIL(productSlug),
      });
    },
  });
};
