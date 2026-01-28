import axios from 'axios';
import { store } from '@/store';
import { updateTokens, logout } from '@/features/auth/store/authSlice';
import { scheduleTokenRefresh } from '@/lib/utils/token-refresh';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

// Request interceptor - Add auth token from Redux store
apiClient.interceptors.request.use((config) => {
    const state = store.getState();
    const accessToken = state.auth.tokens?.accessToken;

    console.log('🔍 Axios Interceptor - Making request to:', config.url);
    console.log('🔍 Auth state:', {
        isAuthenticated: state.auth.isAuthenticated,
        hasTokens: !!state.auth.tokens,
        hasAccessToken: !!accessToken,
        tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'NO TOKEN'
    });

    // Set Content-Type to application/json only if not already set and not FormData
    if (config.headers && !config.headers['Content-Type']) {
        // Check if data is FormData (for file uploads)
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
    }

    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log('✅ Authorization header added');
    } else {
        console.log('❌ No access token available');
    }

    return config;
});

// Response interceptor - Handle 401 errors (fallback token refresh)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const state = store.getState();
                const refreshToken = state.auth.tokens?.refreshToken;

                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data.data;

                // Update Redux store (this will also update localStorage)
                store.dispatch(updateTokens({
                    accessToken,
                    refreshToken: newRefreshToken
                }));

                // Schedule next proactive refresh
                scheduleTokenRefresh(accessToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed - logout user
                store.dispatch(logout());
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
