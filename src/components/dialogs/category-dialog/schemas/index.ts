import { z } from 'zod';

import { VALIDATION_MESSAGES } from '@/constants/messages/shared';
import { SLUG_REGEX } from '@/constants/regex';
import { CATEGORY_FORM_FIELD_NAMES, CATEGORY_LIMITS } from '../constants';

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || z.url().safeParse(value).success,
    VALIDATION_MESSAGES.URL.INVALID,
  );

export const categoryFormSchema = z.object({
  [CATEGORY_FORM_FIELD_NAMES.NAME]: z
    .string()
    .trim()
    .min(1, VALIDATION_MESSAGES.CATEGORY.NAME_REQUIRED)
    .max(CATEGORY_LIMITS.NAME_MAX, VALIDATION_MESSAGES.CATEGORY.NAME_MAX),
  [CATEGORY_FORM_FIELD_NAMES.SLUG]: z
    .string()
    .trim()
    .max(CATEGORY_LIMITS.SLUG_MAX, VALIDATION_MESSAGES.CATEGORY.SLUG_MAX)
    .refine(
      (value) => value === '' || SLUG_REGEX.test(value),
      VALIDATION_MESSAGES.SLUG.INVALID,
    ),
  [CATEGORY_FORM_FIELD_NAMES.DESCRIPTION]: z
    .string()
    .trim()
    .max(
      CATEGORY_LIMITS.DESCRIPTION_MAX,
      VALIDATION_MESSAGES.CATEGORY.DESCRIPTION_MAX,
    ),
  [CATEGORY_FORM_FIELD_NAMES.IMAGE]: optionalUrl,
  [CATEGORY_FORM_FIELD_NAMES.PARENT_ID]: z.string().uuid().nullable(),
  [CATEGORY_FORM_FIELD_NAMES.IS_ACTIVE]: z.boolean(),
});
