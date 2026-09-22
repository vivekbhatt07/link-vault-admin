import api from '@/api';
import type {
  ApiResponse,
  AuthPayload,
  ChangePasswordPayload,
  SignInPayload,
  UpdateProfilePayload,
  User,
} from '@/types/api';

export const authService = {
  signIn: async (payload: SignInPayload) => {
    const { data } = await api.post<ApiResponse<AuthPayload>>(
      '/auth/sign-in',
      payload,
    );
    return data;
  },

  me: async () => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const { data } = await api.patch<ApiResponse<User>>('/auth/me', payload);
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const { data } = await api.patch<ApiResponse>(
      '/auth/change-password',
      payload,
    );
    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post<ApiResponse>('/auth/forgot-password', {
      email,
    });
    return data;
  },
};
