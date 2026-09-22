export const ROUTES = {
  PRIVATE: {
    DASHBOARD: '/',
    CATEGORIES: '/categories',
    PRODUCTS: {
      ROOT: '/products',
      CREATE: '/products/new',
      DETAIL: (slug: string) => `/products/${slug}`,
      EDIT: (slug: string) => `/products/${slug}/edit`,
    },
    TESTIMONIALS: '/testimonials',
    SETTINGS: {
      ROOT: '/settings',
      PROFILE: '/settings/profile',
      SECURITY: '/settings/security',
      APPEARANCE: '/settings/appearance',
    },
  },
  PUBLIC: {
    AUTH: {
      SIGN_IN: '/sign-in',
      FORGOT_PASSWORD: '/forgot-password',
    },
  },
};
