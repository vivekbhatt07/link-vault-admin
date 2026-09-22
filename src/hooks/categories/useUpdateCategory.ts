import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { categoriesService } from '@/api/services/categories';
import { QUERY_KEYS } from '@/constants/query-key';
import type { UpdateCategoryPayload } from '@/types/api';

type TVariables = { id: string; payload: UpdateCategoryPayload };

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: TVariables) =>
      categoriesService.update(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
      // Products embed their category; a rename must show up there too.
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
    },
  });
};
