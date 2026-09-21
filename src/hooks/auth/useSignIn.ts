import { useMutation } from '@tanstack/react-query';

import { ApiError } from '@/api/error';
import { authService } from '@/api/services/auth';
import { AUTH_MESSAGES } from '@/constants/messages/auth';
import { useAuthStore } from '@/store/authStore';
import type { SignInPayload } from '@/types/api';

/**
 * Sign-in succeeds for any verified user; the backend only rejects non-admins
 * on admin routes. The role gate lives here so a USER token is never stored.
 */
export const useSignIn = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    // Errors are rendered inline by the sign-in form.
    meta: { silent: true },
    mutationFn: async (payload: SignInPayload) => {
      const response = await authService.signIn(payload);
      const auth = response.data;
      if (!auth) throw new ApiError(response.message);
      if (auth.user.role !== 'ADMIN') {
        throw new ApiError(AUTH_MESSAGES.ADMIN_ONLY, { status: 403 });
      }
      setAuth(auth.user, auth.token);
      return response;
    },
  });
};
