import { useMutation, useQueryClient } from '@tanstack/react-query';

import { categoriesService } from '@/api/services/categories';
import { QUERY_KEYS } from '@/constants/query-key';
import type { ReorderCategoriesPayload } from '@/types/api';

/**
 * Silent: the tree UI reorders optimistically via drag-and-drop, so a toast
 * on every successful drop would be noisy. Failures still surface via the
 * global mutation-cache error toast.
 */
export const useReorderCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { silent: true },
    mutationFn: (payload: ReorderCategoriesPayload) =>
      categoriesService.reorder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
};
