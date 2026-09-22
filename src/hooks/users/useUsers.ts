import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { usersService } from '@/api/services/users';
import { QUERY_KEYS } from '@/constants/query-key';
import type { UserListParams } from '@/types/api';

export const useUsers = (params: UserListParams = {}) =>
  useQuery({
    queryKey: QUERY_KEYS.USERS.LIST(params),
    queryFn: async () => {
      const response = await usersService.list(params);
      return (
        response.data ?? {
          items: [],
          total: 0,
          page: params.page ?? 1,
          limit: params.limit ?? 20,
          hasMore: false,
        }
      );
    },
    placeholderData: keepPreviousData,
  });
