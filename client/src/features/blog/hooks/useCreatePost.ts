'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { blogService } from '../services/blog.service';
import { blogKeys } from '../utils/blog.keys';
import { getErrorMessage } from '@/lib/api/api.types';
import type { CreatePostRequest } from '../types';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => blogService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success('Post created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
