import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authService } from '@/api/services/auth';

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: (response) => {
      toast.success(response.message);
    },
  });
