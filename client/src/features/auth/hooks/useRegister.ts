'use client';

import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '../store/authSlice';
import { authService } from '../services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import { setAuthCookie } from '@/lib/auth/cookies';
import type { IRegisterRequest } from '../types/auth.types';

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: IRegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      // Set cookie for middleware auth check
      setAuthCookie(data.tokens.accessToken);
      toast.success('რეგისტრაცია წარმატებულია!');
      router.push('/profile');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
