import { create } from 'zustand';

/** Backend window is 15 minutes per IP; used when no Retry-After is readable. */
const DEFAULT_RETRY_AFTER_SECONDS = 15 * 60;

interface RateLimitState {
  isLimited: boolean;
  message: string | null;
  /** Epoch ms when the limit is expected to lift. */
  resetAt: number | null;

  trigger: (message: string, retryAfterSeconds: number | null) => void;
  clear: () => void;
}

export const useRateLimitStore = create<RateLimitState>((set) => ({
  isLimited: false,
  message: null,
  resetAt: null,

  trigger: (message, retryAfterSeconds) =>
    set({
      isLimited: true,
      message,
      resetAt:
        Date.now() + (retryAfterSeconds ?? DEFAULT_RETRY_AFTER_SECONDS) * 1000,
    }),

  clear: () => set({ isLimited: false, message: null, resetAt: null }),
}));
