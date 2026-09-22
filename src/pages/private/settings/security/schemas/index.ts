import { z } from 'zod';

import { PASSWORD_REGEX } from '@/constants/regex';
import { VALIDATION_MESSAGES } from '@/constants/messages/shared';
import { SECURITY_FORM_FIELD_NAMES } from '../constants';

const { CURRENT_PASSWORD, NEW_PASSWORD, CONFIRM_NEW_PASSWORD } =
  SECURITY_FORM_FIELD_NAMES;

export const securityFormSchema = z
  .object({
    [CURRENT_PASSWORD]: z
      .string()
      .min(1, VALIDATION_MESSAGES.CURRENT_PASSWORD.REQUIRED),
    [NEW_PASSWORD]: z
      .string()
      .min(1, VALIDATION_MESSAGES.PASSWORD.REQUIRED)
      .regex(PASSWORD_REGEX, VALIDATION_MESSAGES.PASSWORD.INVALID),
    [CONFIRM_NEW_PASSWORD]: z
      .string()
      .min(1, VALIDATION_MESSAGES.CONFIRM_PASSWORD.REQUIRED),
  })
  .refine((data) => data[NEW_PASSWORD] === data[CONFIRM_NEW_PASSWORD], {
    message: VALIDATION_MESSAGES.CONFIRM_PASSWORD.INVALID,
    path: [CONFIRM_NEW_PASSWORD],
  })
  .refine((data) => data[NEW_PASSWORD] !== data[CURRENT_PASSWORD], {
    message: 'New password cannot be the same as current password',
    path: [NEW_PASSWORD],
  });
