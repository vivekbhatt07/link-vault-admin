import { useEffect, useRef, useState } from 'react';

import { authService } from '@/api/services/auth';
import { useAuthStore } from '@/store/authStore';

/**
 * On boot, re-hydrate the persisted session via GET /auth/me and re-check the
 * role. Any failure (expired token, unverified, demoted to USER) clears the
 * session; the API client already handles 401/403 side-effects.
 */
export const useAuthBootstrap = () => {
  const token = useAuthStore((state) => state.token);
  const [isHydrating, setIsHydrating] = useState(() => Boolean(token));
  // One request per page load, even under StrictMode double-effects.
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!token || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const { setUser, logout } = useAuthStore.getState();

    authService
      .me()
      .then((response) => {
        const user = response.data;
        if (user?.role === 'ADMIN') {
          setUser(user);
        } else {
          logout();
        }
      })
      .catch(() => {
        // Non-auth failures (network, 429) keep the persisted session; the
        // next protected request will settle it.
      })
      .finally(() => setIsHydrating(false));
  }, [token]);

  return { isHydrating };
};
