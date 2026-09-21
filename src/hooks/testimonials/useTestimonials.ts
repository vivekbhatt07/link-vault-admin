import { useQuery } from '@tanstack/react-query';

import { testimonialsService } from '@/api/services/testimonials';
import { QUERY_KEYS } from '@/constants/query-key';

/** Per-product only — there is no global testimonial feed. */
export const useTestimonials = (productId: string | undefined) =>
  useQuery({
    queryKey: QUERY_KEYS.TESTIMONIALS.LIST(productId ?? ''),
    queryFn: async () =>
      (await testimonialsService.listByProduct(productId!)).data ?? [],
    enabled: Boolean(productId),
  });
