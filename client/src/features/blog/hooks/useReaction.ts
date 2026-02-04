'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '../services/blog.service';
import { blogKeys } from '../utils/blog.keys';
import type { ReactionType } from '../types';

// Generate or get session ID for anonymous reactions
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('blog_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('blog_session_id', sessionId);
  }
  return sessionId;
}

export function useReaction(postId: string, slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (type: ReactionType) => {
      const sessionId = getSessionId();
      return blogService.addReaction(postId, { type, sessionId });
    },
    onSuccess: () => {
      // Invalidate the post detail to refresh reaction counts
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(slug) });
    },
  });
}

export function useRemoveReaction(postId: string, slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const sessionId = getSessionId();
      return blogService.removeReaction(postId, sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(slug) });
    },
  });
}

export { getSessionId };
