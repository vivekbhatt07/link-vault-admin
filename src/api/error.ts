export type TApiFieldError = { field: string; message: string };

type TApiErrorOptions = {
  status?: number;
  fieldErrors?: TApiFieldError[];
  /**
   * `true` when the API client already performed the side-effect for this
   * error (sign-out on 401/403, rate-limit banner on 429). Consumers should
   * skip their generic error toast when this is set.
   */
  handled?: boolean;
};

export class ApiError extends Error {
  readonly status?: number;
  readonly fieldErrors?: TApiFieldError[];
  readonly handled: boolean;

  constructor(message: string, options: TApiErrorOptions = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.fieldErrors = options.fieldErrors;
    this.handled = options.handled ?? false;
  }
}

/**
 * The backend returns validation errors as a JSON-stringified array in
 * `error`: `"[{\"field\":\"price\",\"message\":\"...\"}]"`.
 */
export const parseFieldErrors = (
  raw: string | undefined,
): TApiFieldError[] | undefined => {
  if (!raw) return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return undefined;
    return parsed.filter(
      (item): item is TApiFieldError =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.field === 'string' &&
        typeof item.message === 'string',
    );
  } catch {
    return undefined;
  }
};

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError;

export const getErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong',
) => (error instanceof Error && error.message ? error.message : fallback);
