import api from '@/api';
import type { ApiResponse, Paginated, User, UserListParams } from '@/types/api';

const toQuery = (params: UserListParams) => {
  const query: Record<string, string> = {};
  if (params.role) query.role = params.role;
  if (params.search) query.search = params.search;
  if (params.page) query.page = String(params.page);
  if (params.limit) query.limit = String(params.limit);
  return query;
};

export const usersService = {
  /** Newest first. Read-only — there is no detail/edit/delete/role endpoint. */
  list: async (params: UserListParams = {}) => {
    const { data } = await api.get<ApiResponse<Paginated<User>>>('/users', {
      params: toQuery(params),
    });
    return data;
  },
};
