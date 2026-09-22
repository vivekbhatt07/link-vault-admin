import api from '@/api';
import type {
  ApiResponse,
  CategoryListParams,
  CategoryDetail,
  CategoryTreeNode,
  CategoryTreeParams,
  CategoryWithCount,
  CreateCategoryPayload,
  ReorderCategoriesPayload,
  UpdateCategoryPayload,
} from '@/types/api';

const toListQuery = (params: CategoryListParams) => {
  const query: Record<string, string> = {};
  if (params.parentId) query.parentId = params.parentId;
  if (params.rootOnly) query.rootOnly = 'true';
  if (params.includeInactive) query.includeInactive = 'true';
  return query;
};

export const categoriesService = {
  /** Flat, sorted by sortOrder then name. Not paginated. */
  list: async (params: CategoryListParams = {}) => {
    const { data } = await api.get<ApiResponse<CategoryWithCount[]>>(
      '/categories',
      { params: toListQuery(params) },
    );
    return data;
  },

  /** Full nested tree, roots first, children sorted. */
  tree: async (params: CategoryTreeParams = {}) => {
    const { data } = await api.get<ApiResponse<CategoryTreeNode[]>>(
      '/categories/tree',
      {
        params: params.includeInactive ? { includeInactive: 'true' } : {},
      },
    );
    return data;
  },

  getBySlug: async (slug: string, includeInactive = false) => {
    const { data } = await api.get<ApiResponse<CategoryDetail>>(
      `/categories/${slug}`,
      { params: includeInactive ? { includeInactive: 'true' } : {} },
    );
    return data;
  },

  create: async (payload: CreateCategoryPayload) => {
    const { data } = await api.post<ApiResponse<CategoryWithCount>>(
      '/categories',
      payload,
    );
    return data;
  },

  update: async (id: string, payload: UpdateCategoryPayload) => {
    const { data } = await api.patch<ApiResponse<CategoryWithCount>>(
      `/categories/${id}`,
      payload,
    );
    return data;
  },

  /** Applied in one transaction. 1–200 items. */
  reorder: async (payload: ReorderCategoriesPayload) => {
    const { data } = await api.patch<ApiResponse>(
      '/categories/reorder',
      payload,
    );
    return data;
  },

  remove: async (id: string) => {
    const { data } = await api.delete<ApiResponse>(`/categories/${id}`);
    return data;
  },
};
