import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { categoriesService } from '@/api/services/categories';
import { QUERY_KEYS } from '@/constants/query-key';
import type { CreateCategoryPayload } from '@/types/api';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoriesService.create(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
};
