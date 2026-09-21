import { z } from 'zod';

import { VALIDATION_MESSAGES } from '@/constants/messages/shared';
import { PRODUCT_FORM_FIELD_NAMES, PRODUCT_LIMITS } from '../constants';

const { PRODUCT, URL } = VALIDATION_MESSAGES;

export const productFormSchema = z.object({
  [PRODUCT_FORM_FIELD_NAMES.NAME]: z
    .string()
    .trim()
    .min(1, PRODUCT.NAME_REQUIRED)
    .max(PRODUCT_LIMITS.NAME_MAX, PRODUCT.NAME_MAX),
  [PRODUCT_FORM_FIELD_NAMES.DESCRIPTION]: z
    .string()
    .trim()
    .max(PRODUCT_LIMITS.DESCRIPTION_MAX, PRODUCT.DESCRIPTION_MAX),
  // Numeric inputs hand NaN to the form while empty; z.number() rejects it.
  [PRODUCT_FORM_FIELD_NAMES.PRICE]: z
    .number({ error: PRODUCT.PRICE_REQUIRED })
    .positive(PRODUCT.PRICE_POSITIVE),
  [PRODUCT_FORM_FIELD_NAMES.STOCK]: z
    .number({ error: PRODUCT.STOCK_REQUIRED })
    .int(PRODUCT.STOCK_INTEGER)
    .min(0, PRODUCT.STOCK_MIN),
  [PRODUCT_FORM_FIELD_NAMES.CATEGORY_ID]: z
    .string()
    .min(1, PRODUCT.CATEGORY_REQUIRED)
    .pipe(z.uuid(PRODUCT.CATEGORY_REQUIRED)),
  [PRODUCT_FORM_FIELD_NAMES.IMAGES]: z.array(z.url(URL.INVALID)),
  [PRODUCT_FORM_FIELD_NAMES.IS_FEATURED]: z.boolean(),
  [PRODUCT_FORM_FIELD_NAMES.IS_ACTIVE]: z.boolean(),
});
