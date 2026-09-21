/**
 * Shared API contract types. These mirror the backend exactly — do not add
 * fields the backend does not return.
 */

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  avatar: string | null;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

/** Only returned by GET /api/products/:slug */
export interface ProductDetail extends Product {
  avgRating: number;
  testimonialCount: number;
}

export interface Testimonial {
  id: string;
  content: string;
  rating: number;
  userId: string;
  productId: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

/* ── Request payloads ─────────────────────────────────────────── */

export interface SignInPayload {
  email: string;
  password: string;
}

/**
 * TODO(backend): the contract types optional fields as plain strings and does
 * not say how to clear one. The panel sends `null` for a cleared value.
 */
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string | null;
  avatar?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string | null;
  image?: string | null;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  images?: string[];
  stock?: number;
  isFeatured?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string | null;
  price?: number;
  images?: string[];
  stock?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  categoryId?: string;
}

export interface ProductListParams {
  categoryId?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}
