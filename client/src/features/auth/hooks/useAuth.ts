'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout as logoutAction } from '../store/authSlice';
import { authService } from '../services/auth.service';
import { useRouter } from 'next/navigation';
import { clearAuthCookie } from '@/lib/auth/cookies';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, tokens, isLoading } = useAppSelector(
    (state) => state.auth
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      dispatch(logoutAction());
      // Clear auth cookie for middleware
      clearAuthCookie();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
      router.push('/login');
    }
  }, [dispatch, router]);

  return {
    user,
    isAuthenticated,
    tokens,
    isLoading,
    logout,
  };
};
