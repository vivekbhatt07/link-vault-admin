import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    logout();
    queryClient.clear();
    navigate(ROUTES.PUBLIC.AUTH.SIGN_IN, { replace: true });
  };
};
