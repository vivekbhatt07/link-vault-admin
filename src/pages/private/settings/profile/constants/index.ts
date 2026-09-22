export const PROFILE_FORM_FIELD_NAMES = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  BIO: 'bio',
  AVATAR: 'avatar',
} as const;

export const PROFILE_LIMITS = {
  NAME_MAX: 50,
  BIO_MAX: 200,
} as const;
