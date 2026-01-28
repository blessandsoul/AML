import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { logout as logoutAction, updateUser } from '../store/authSlice';
import { ROUTES } from '@/lib/constants/routes';
import { stopTokenRefreshMonitoring } from '@/lib/utils/token-refresh';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useAuth = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated, tokens } = useAppSelector((state) => state.auth);

    const refreshUser = useCallback(async () => {
        try {
            const userData = await authService.getMe();
            dispatch(updateUser(userData));
            return userData;
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            return null;
        }
    }, [dispatch]);

    const logout = async () => {
        try {
            // Send logout request to server with refresh token
            if (tokens?.refreshToken) {
                await authService.logout(tokens.refreshToken);
            }
            toast.success(t('auth.logout_success'));
        } catch (error) {
            // Still logout locally even if server request fails
            console.error('Logout error:', error);
        } finally {
            // Stop token refresh monitoring
            stopTokenRefreshMonitoring();
            // Clear Redux state
            dispatch(logoutAction());
            // Clear localStorage
            localStorage.removeItem('auth');
            // Navigate to home
            navigate(ROUTES.HOME);
        }
    };

    return {
        user,
        isAuthenticated,
        tokens,
        logout,
        refreshUser,
    };
};
