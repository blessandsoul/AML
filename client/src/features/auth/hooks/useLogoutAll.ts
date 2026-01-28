import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { logout as logoutAction } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants/routes';
import { stopTokenRefreshMonitoring } from '@/lib/utils/token-refresh';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '@/lib/utils/error';

export const useLogoutAll = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => authService.logoutAll(),
        onSuccess: () => {
            // Stop token refresh monitoring
            stopTokenRefreshMonitoring();
            // Clear Redux state
            dispatch(logoutAction());
            // Clear localStorage
            localStorage.removeItem('auth');
            // Show success message
            toast.success(t('auth.logout_all_success'));
            // Navigate to home
            navigate(ROUTES.HOME);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};
