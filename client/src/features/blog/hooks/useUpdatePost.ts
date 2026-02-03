'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { blogService } from '../services/blog.service';
import { blogKeys } from '../utils/blog.keys';
import { getErrorMessage } from '@/lib/api/api.types';
import type { UpdatePostRequest } from '../types';

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => blogService.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success('Post updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function usePublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.publishPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success('Post published successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUnpublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.unpublishPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success('Post unpublished successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success('Post deleted successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
