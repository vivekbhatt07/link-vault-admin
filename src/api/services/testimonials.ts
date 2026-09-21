import api from '@/api';
import type { ApiResponse, Testimonial } from '@/types/api';

export const testimonialsService = {
  /** Newest first, not paginated. `productId` is required. */
  listByProduct: async (productId: string) => {
    const { data } = await api.get<ApiResponse<Testimonial[]>>(
      '/testimonials',
      { params: { productId } },
    );
    return data;
  },

  remove: async (id: string) => {
    const { data } = await api.delete<ApiResponse>(`/testimonials/${id}`);
    return data;
  },
};
