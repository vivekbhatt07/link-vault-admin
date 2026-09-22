/** Backend default is 20; max is 100. */
export const TESTIMONIAL_LIST_LIMIT = 20;

/** Query-string keys for the testimonials list (server-side paging only). */
export const TESTIMONIAL_LIST_SEARCH_PARAMS = {
  PAGE: 'page',
} as const;
