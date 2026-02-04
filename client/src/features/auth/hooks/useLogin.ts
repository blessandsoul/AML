'use client';

import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '../store/authSlice';
import { authService } from '../services/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import { setAuthCookie } from '@/lib/auth/cookies';
import type { ILoginRequest } from '../types/auth.types';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (data: ILoginRequest) => authService.login(data),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      // Set cookie for middleware auth check
      setAuthCookie(data.tokens.accessToken);
      toast.success('შესვლა წარმატებულია!');
      // Redirect to 'from' param or default to profile
      const from = searchParams.get('from') || '/profile';
      router.push(from);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
