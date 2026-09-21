import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { categoriesService } from '@/api/services/categories';
import { QUERY_KEYS } from '@/constants/query-key';

/**
 * 409 ("Cannot delete category — reassign or delete its products first") is
 * surfaced by the caller verbatim, so errors are silent here.
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { silent: true },
    mutationFn: (id: string) => categoriesService.remove(id),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
};
