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

/* ── Categories ────────────────────────────────────────────────── */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Direct products only (not descendants). */
export interface CategoryWithCount extends Category {
  productCount: number;
}

export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryTreeNode extends CategoryWithCount {
  children: CategoryTreeNode[];
}

/** Only from GET /api/categories/:slug */
export interface CategoryDetail extends CategoryWithCount {
  parent: CategoryRef | null;
  /** Root → this category (inclusive). */
  breadcrumbs: CategoryRef[];
  /** Direct children only. */
  children: CategoryWithCount[];
}

/* ── Products ──────────────────────────────────────────────────── */

export type ProductAvailability =
  | 'IN_STOCK'
  | 'OUT_OF_STOCK'
  | 'MADE_TO_ORDER'
  | 'COMING_SOON';

export type PurchaseLinkPlatform =
  | 'AMAZON'
  | 'FLIPKART'
  | 'MEESHO'
  | 'ETSY'
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'WEBSITE'
  | 'OTHER';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface PurchaseLink {
  platform: PurchaseLinkPlatform;
  label: string | null;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  /** Stored UPPERCASE, unique. */
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  highlights: string[];
  price: number;
  /** MRP / strike-through; always > price when set. */
  compareAtPrice: number | null;
  /** Read-only, derived from compareAtPrice. */
  discountPercentage: number | null;
  images: string[];
  videoUrl: string | null;
  material: string | null;
  dimensions: string | null;
  weight: string | null;
  careInstructions: string | null;
  specifications: ProductSpecification[];
  /** Stored lowercase, deduped. */
  tags: string[];
  stock: number;
  /** Admin-chosen; independent of stock. */
  availability: ProductAvailability;
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  /** Per-product override of the store template. */
  whatsappMessage: string | null;
  /** Read-only, derived; null until a WhatsApp number is set in settings. */
  whatsappUrl: string | null;
  purchaseLinks: PurchaseLink[];
  metaTitle: string | null;
  metaDescription: string | null;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

/** Only from GET /api/products/:slug */
export interface ProductDetail extends Product {
  avgRating: number;
  testimonialCount: number;
  /** Root → the product's category. */
  breadcrumbs: CategoryRef[];
  /** Up to 4 active products from the same category. */
  relatedProducts: Product[];
}

/* ── Store settings ────────────────────────────────────────────── */

export interface StoreSettings {
  /** Digits only with country code, e.g. "919876543210". */
  whatsappNumber: string | null;
  /** Placeholders: {{productName}} {{price}} {{productUrl}} */
  whatsappMessageTemplate: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  /** Null until first saved. */
  updatedAt: string | null;
}

/* ── Testimonials ──────────────────────────────────────────────── */

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

/** Only from GET /api/testimonials/all */
export interface TestimonialWithProduct extends Testimonial {
  product: { id: string; name: string; slug: string };
}

export interface TestimonialListParams {
  page?: number;
  limit?: number;
}

/* ── Uploads ───────────────────────────────────────────────────── */

export interface UploadedImage {
  url: string;
  publicId: string;
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

export interface CategoryListParams {
  parentId?: string;
  rootOnly?: boolean;
  includeInactive?: boolean;
}

export interface CategoryTreeParams {
  includeInactive?: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface ReorderCategoriesPayload {
  items: { id: string; sortOrder: number }[];
}

export type ProductSort =
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc';

export interface ProductListParams {
  categoryId?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  availability?: ProductAvailability;
  tag?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  categoryId: string;
  slug?: string;
  sku?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  highlights?: string[];
  compareAtPrice?: number | null;
  images?: string[];
  videoUrl?: string | null;
  material?: string | null;
  dimensions?: string | null;
  weight?: string | null;
  careInstructions?: string | null;
  specifications?: ProductSpecification[];
  tags?: string[];
  stock?: number;
  availability?: ProductAvailability;
  isFeatured?: boolean;
  isBestseller?: boolean;
  whatsappMessage?: string | null;
  purchaseLinks?: PurchaseLink[];
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  isActive?: boolean;
}

export interface UpdateSettingsPayload {
  whatsappNumber?: string | null;
  whatsappMessageTemplate?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface UserListParams {
  role?: Role;
  search?: string;
  page?: number;
  limit?: number;
}
