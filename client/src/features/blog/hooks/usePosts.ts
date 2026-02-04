'use client';

import { useQuery } from '@tanstack/react-query';
import { blogService } from '../services/blog.service';
import { blogKeys } from '../utils/blog.keys';
import { getMockPosts, MOCK_POSTS } from '../data/mock-posts';
import type { PostFilters } from '../types';

// Use environment variable to toggle mock data
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export function usePosts(filters: PostFilters = {}) {
  return useQuery({
    queryKey: blogKeys.list(filters),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 300));
        return getMockPosts({
          page: filters.page,
          limit: filters.limit,
          category_id: filters.category_id,
          search: filters.search,
        });
      }
      return blogService.getPosts(filters);
    },
  });
}

export function useAdminPosts(filters: PostFilters = {}) {
  return useQuery({
    queryKey: blogKeys.adminList(filters),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 300));
        return getMockPosts({
          page: filters.page,
          limit: filters.limit,
          category_id: filters.category_id,
          search: filters.search,
        });
      }
      return blogService.getAdminPosts(filters);
    },
  });
}
