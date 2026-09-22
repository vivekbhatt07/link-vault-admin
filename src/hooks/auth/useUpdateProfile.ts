import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authService } from '@/api/services/auth';
import { useAuthStore } from '@/store/authStore';
import type { UpdateProfilePayload } from '@/types/api';

export const useUpdateProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      authService.updateProfile(payload),
    onSuccess: (response) => {
      if (response.data) setUser(response.data);
      toast.success(response.message);
    },
  });
};
