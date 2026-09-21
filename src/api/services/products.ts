import api from '@/api';
import type {
  ApiResponse,
  CreateProductPayload,
  Paginated,
  Product,
  ProductDetail,
  ProductListParams,
  UpdateProductPayload,
} from '@/types/api';

const toQuery = (params: ProductListParams) => {
  const query: Record<string, string> = {};
  if (params.categoryId) query.categoryId = params.categoryId;
  if (params.isFeatured !== undefined) {
    query.isFeatured = String(params.isFeatured);
  }
  if (params.page) query.page = String(params.page);
  if (params.limit) query.limit = String(params.limit);
  return query;
};

export const productsService = {
  /** Newest first. Only `isActive: true` products are ever returned. */
  list: async (params: ProductListParams = {}) => {
    const { data } = await api.get<ApiResponse<Paginated<Product>>>(
      '/products',
      { params: toQuery(params) },
    );
    return data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get<ApiResponse<ProductDetail>>(
      `/products/${slug}`,
    );
    return data;
  },

  create: async (payload: CreateProductPayload) => {
    const { data } = await api.post<ApiResponse<Product>>('/products', payload);
    return data;
  },

  update: async (id: string, payload: UpdateProductPayload) => {
    const { data } = await api.patch<ApiResponse<Product>>(
      `/products/${id}`,
      payload,
    );
    return data;
  },

  /** Hard delete. Cascades every testimonial on the product. */
  remove: async (id: string) => {
    const { data } = await api.delete<ApiResponse>(`/products/${id}`);
    return data;
  },
};
