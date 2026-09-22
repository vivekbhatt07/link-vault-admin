import api from '@/api';
import type {
  ApiResponse,
  Paginated,
  Testimonial,
  TestimonialListParams,
  TestimonialWithProduct,
} from '@/types/api';

export const testimonialsService = {
  /** Newest first, not paginated. `productId` is required. */
  listByProduct: async (productId: string) => {
    const { data } = await api.get<ApiResponse<Testimonial[]>>(
      '/testimonials',
      { params: { productId } },
    );
    return data;
  },

  /** Newest first, across all products. Admin only. */
  listAll: async (params: TestimonialListParams = {}) => {
    const query: Record<string, string> = {};
    if (params.page) query.page = String(params.page);
    if (params.limit) query.limit = String(params.limit);

    const { data } = await api.get<ApiResponse<Paginated<TestimonialWithProduct>>>(
      '/testimonials/all',
      { params: query },
    );
    return data;
  },

  remove: async (id: string) => {
    const { data } = await api.delete<ApiResponse>(`/testimonials/${id}`);
    return data;
  },
};
