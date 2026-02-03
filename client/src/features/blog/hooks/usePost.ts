'use client';

import { useQuery } from '@tanstack/react-query';
import { blogService } from '../services/blog.service';
import { blogKeys } from '../utils/blog.keys';
import { getMockPostBySlug, MOCK_POSTS } from '../data/mock-posts';

// Set to true to use mock data (for development without backend)
const USE_MOCK_DATA = true;

export function usePost(slug: string) {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 300));
        const post = getMockPostBySlug(slug);
        if (!post) throw new Error('Post not found');
        return post;
      }
      return blogService.getPostBySlug(slug);
    },
    enabled: !!slug,
  });
}

export function usePostById(id: string) {
  return useQuery({
    queryKey: blogKeys.detailById(id),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 300));
        const post = MOCK_POSTS.find((p) => p.id === id);
        if (!post) throw new Error('Post not found');
        return post;
      }
      return blogService.getPostById(id);
    },
    enabled: !!id,
  });
}
