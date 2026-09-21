import type { ProductListParams } from '@/types/api';

export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  CATEGORIES: {
    ALL: ['categories'] as const,
    LIST: ['categories', 'list'] as const,
    DETAIL: (slug: string) => ['categories', 'detail', slug] as const,
  },
  PRODUCTS: {
    ALL: ['products'] as const,
    LISTS: ['products', 'list'] as const,
    LIST: (params: ProductListParams) => ['products', 'list', params] as const,
    DETAIL: (slug: string) => ['products', 'detail', slug] as const,
  },
  TESTIMONIALS: {
    ALL: ['testimonials'] as const,
    LIST: (productId: string) => ['testimonials', 'list', productId] as const,
  },
};
