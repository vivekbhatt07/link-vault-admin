import { useMutation } from '@tanstack/react-query';

import { uploadService } from '@/api/services/upload';

/** Errors (incl. 503 "not configured") surface via the global toast. */
export const useUploadAvatar = () =>
  useMutation({
    mutationFn: (file: File) => uploadService.avatar(file),
  });
