import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { isApiError } from '@/api/error';

/**
 * Maps backend validation errors (`{ field, message }[]`) onto react-hook-form
 * fields. Backend array paths look like `images[0]`; RHF expects `images.0`.
 *
 * Returns `true` when at least one field error was applied.
 */
export const applyApiFieldErrors = <TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  error: unknown,
): boolean => {
  if (!isApiError(error) || !error.fieldErrors?.length) return false;

  error.fieldErrors.forEach(({ field, message }) => {
    const path = field.replace(/\[(\d+)\]/g, '.$1') as Path<TFieldValues>;
    form.setError(path, { type: 'server', message });
  });

  return true;
};

/**
 * Returns only the keys of `next` whose value differs from `current`.
 * Used so PATCH requests send just the changed fields (and never re-send an
 * unchanged `name`, which would otherwise regenerate the slug).
 */
export const pickChangedFields = <T extends Record<string, unknown>>(
  current: T,
  next: T,
): Partial<T> => {
  const changed: Partial<T> = {};
  (Object.keys(next) as (keyof T)[]).forEach((key) => {
    const a = current[key];
    const b = next[key];
    const isEqual =
      Array.isArray(a) && Array.isArray(b)
        ? a.length === b.length && a.every((v, i) => v === b[i])
        : a === b;
    if (!isEqual) changed[key] = b;
  });
  return changed;
};
