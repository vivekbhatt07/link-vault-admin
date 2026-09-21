export const PRODUCT_FORM_FIELD_NAMES = {
  NAME: 'name',
  DESCRIPTION: 'description',
  PRICE: 'price',
  STOCK: 'stock',
  CATEGORY_ID: 'categoryId',
  IMAGES: 'images',
  IS_FEATURED: 'isFeatured',
  IS_ACTIVE: 'isActive',
} as const;

export const PRODUCT_LIMITS = {
  NAME_MAX: 100,
  DESCRIPTION_MAX: 2000,
} as const;

/** Backend default is 20; max is 100. */
export const PRODUCT_LIST_LIMIT = 20;

export const PRODUCT_DELETE_CONFIRMATION = 'DELETE';

export const DEACTIVATE_WARNING =
  'Deactivated products cannot be viewed or re-activated from this panel yet.';

/** Query-string keys for the product list (server-side filters only). */
export const PRODUCT_LIST_SEARCH_PARAMS = {
  PAGE: 'page',
  CATEGORY_ID: 'categoryId',
  IS_FEATURED: 'isFeatured',
} as const;

/** Radix Select cannot use an empty string as a value. */
export const FILTER_ALL = 'all';
