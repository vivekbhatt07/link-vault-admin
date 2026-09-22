import { useMutation } from '@tanstack/react-query';

import { uploadService } from '@/api/services/upload';

/**
 * Errors (incl. 503 "Image upload is not configured on the server") surface
 * via the global mutation-cache toast. Callers keep their paste-a-URL field
 * usable regardless — this is purely additive.
 */
export const useUploadImages = () =>
  useMutation({
    mutationFn: (files: File[]) => uploadService.images(files),
  });
