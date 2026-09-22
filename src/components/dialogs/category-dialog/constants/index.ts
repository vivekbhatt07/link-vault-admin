export const CATEGORY_FORM_FIELD_NAMES = {
  NAME: 'name',
  SLUG: 'slug',
  DESCRIPTION: 'description',
  IMAGE: 'image',
  PARENT_ID: 'parentId',
  IS_ACTIVE: 'isActive',
} as const;

export const CATEGORY_LIMITS = {
  NAME_MAX: 50,
  SLUG_MAX: 120,
  DESCRIPTION_MAX: 300,
} as const;
