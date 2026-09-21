import api from '@/api';
import type {
  ApiResponse,
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/types/api';

export const categoriesService = {
  /** Sorted by name, not paginated, no filters. */
  list: async () => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get<ApiResponse<Category>>(
      `/categories/${slug}`,
    );
    return data;
  },

  create: async (payload: CreateCategoryPayload) => {
    const { data } = await api.post<ApiResponse<Category>>(
      '/categories',
      payload,
    );
    return data;
  },

  update: async (id: string, payload: UpdateCategoryPayload) => {
    const { data } = await api.patch<ApiResponse<Category>>(
      `/categories/${id}`,
      payload,
    );
    return data;
  },

  remove: async (id: string) => {
    const { data } = await api.delete<ApiResponse>(`/categories/${id}`);
    return data;
  },
};
