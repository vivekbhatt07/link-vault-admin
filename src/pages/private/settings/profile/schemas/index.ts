import { z } from 'zod';

import { FIRST_NAME_REGEX, LAST_NAME_REGEX } from '@/constants/regex';
import { VALIDATION_MESSAGES } from '@/constants/messages/shared';
import { PROFILE_FORM_FIELD_NAMES, PROFILE_LIMITS } from '../constants';

const optionalName = (
  regex: RegExp,
  messages: { MAX: string; INVALID: string },
) =>
  z
    .string()
    .trim()
    .max(PROFILE_LIMITS.NAME_MAX, messages.MAX)
    .refine((value) => value === '' || regex.test(value), messages.INVALID);

export const profileFormSchema = z.object({
  [PROFILE_FORM_FIELD_NAMES.FIRST_NAME]: optionalName(
    FIRST_NAME_REGEX,
    VALIDATION_MESSAGES.FIRST_NAME,
  ),
  [PROFILE_FORM_FIELD_NAMES.LAST_NAME]: optionalName(
    LAST_NAME_REGEX,
    VALIDATION_MESSAGES.LAST_NAME,
  ),
  [PROFILE_FORM_FIELD_NAMES.EMAIL]: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL.REQUIRED)
    .pipe(z.email(VALIDATION_MESSAGES.EMAIL.INVALID)),
  [PROFILE_FORM_FIELD_NAMES.BIO]: z
    .string()
    .trim()
    .max(PROFILE_LIMITS.BIO_MAX, VALIDATION_MESSAGES.BIO.MAX),
  [PROFILE_FORM_FIELD_NAMES.AVATAR]: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || z.url().safeParse(value).success,
      VALIDATION_MESSAGES.URL.INVALID,
    ),
});
