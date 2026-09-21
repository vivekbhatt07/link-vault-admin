export const VALIDATION_MESSAGES = {
  FIRST_NAME: {
    MAX: 'First name must be under 50 characters',
    INVALID: 'First name can only contain letters, hyphens, and apostrophes',
  },
  LAST_NAME: {
    MAX: 'Last name must be under 50 characters',
    INVALID: 'Last name can only contain letters, hyphens, and apostrophes',
  },
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Please enter a valid email address',
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    INVALID:
      'Password must be 8-64 characters with uppercase, lowercase, number, and special character',
  },
  CONFIRM_PASSWORD: {
    REQUIRED: 'Confirm password is required',
    INVALID: 'Passwords do not match',
  },
  CURRENT_PASSWORD: {
    REQUIRED: 'Current password is required',
  },
  BIO: {
    MAX: 'Bio must be under 200 characters',
  },
  URL: {
    INVALID: 'Please enter a valid URL',
  },
  CATEGORY: {
    NAME_REQUIRED: 'Category name is required',
    NAME_MAX: 'Category name must be 50 characters or fewer',
    DESCRIPTION_MAX: 'Description must be 300 characters or fewer',
  },
  PRODUCT: {
    NAME_REQUIRED: 'Product name is required',
    NAME_MAX: 'Product name must be 100 characters or fewer',
    DESCRIPTION_MAX: 'Description must be 2000 characters or fewer',
    PRICE_REQUIRED: 'Price is required',
    PRICE_POSITIVE: 'Price must be a positive number',
    STOCK_REQUIRED: 'Stock is required',
    STOCK_INTEGER: 'Stock must be a whole number',
    STOCK_MIN: 'Stock cannot be negative',
    CATEGORY_REQUIRED: 'Please select a category',
  },
};
