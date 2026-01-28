import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '../store/authSlice';
import { ROUTES } from '@/lib/constants/routes';
import { startTokenRefreshMonitoring } from '@/lib/utils/token-refresh';
import type { ILoginRequest } from '../types/auth.types';

import { useTranslation } from 'react-i18next';

export const useLogin = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ILoginRequest) => authService.login(data),
    onSuccess: (response) => {
      console.log('🔐 Login successful, response:', {
        hasUser: !!response.user,
        hasTokens: !!response.tokens,
        hasAccessToken: !!response.tokens?.accessToken,
        hasRefreshToken: !!response.tokens?.refreshToken,
      });

      // Store user and tokens in Redux
      dispatch(setCredentials({
        user: response.user,
        tokens: response.tokens,
      }));

      console.log('✅ Credentials stored in Redux');

      // Start automatic token refresh monitoring
      startTokenRefreshMonitoring();

      // Show success message
      toast.success(t('auth.login_success'));

      // Navigate to home page
      navigate(ROUTES.HOME);
    },
    // Error handling is done in the LoginForm component
  });
};
