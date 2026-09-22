/** Backend default is 20; max is 100. */
export const CUSTOMER_LIST_LIMIT = 20;

/** Query-string keys for the customer list (server-side filters only). */
export const CUSTOMER_LIST_SEARCH_PARAMS = {
  PAGE: 'page',
  ROLE: 'role',
  SEARCH: 'search',
} as const;

/** Radix Select cannot use an empty string as a value. */
export const FILTER_ALL = 'all';
