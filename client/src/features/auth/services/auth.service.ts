import { apiClient } from '@/lib/api/axios.config';
import type {
  IAuthResponse,
  ILoginRequest,
  IRegisterRequest,
  IAuthTokens,
  IUser,
} from '../types/auth.types';
import type { ApiResponse } from '@/lib/api/api.types';

const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
} as const;

class AuthService {
  async register(data: IRegisterRequest): Promise<IAuthResponse> {
    const response = await apiClient.post<ApiResponse<IAuthResponse>>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );
    return response.data.data;
  }

  async login(data: ILoginRequest): Promise<IAuthResponse> {
    const response = await apiClient.post<ApiResponse<IAuthResponse>>(
      AUTH_ENDPOINTS.LOGIN,
      data
    );
    return response.data.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  }

  async refreshToken(refreshToken: string): Promise<IAuthTokens> {
    const response = await apiClient.post<ApiResponse<IAuthTokens>>(
      AUTH_ENDPOINTS.REFRESH,
      { refreshToken }
    );
    return response.data.data;
  }

  async getMe(): Promise<IUser> {
    const response = await apiClient.get<ApiResponse<IUser>>(AUTH_ENDPOINTS.ME);
    return response.data.data;
  }
}

export const authService = new AuthService();
