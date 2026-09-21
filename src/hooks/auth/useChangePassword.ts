import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authService } from '@/api/services/auth';
import type { ChangePasswordPayload } from '@/types/api';

export const useChangePassword = () =>
  useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authService.changePassword(payload),
    onSuccess: (response) => {
      toast.success(response.message);
    },
  });
