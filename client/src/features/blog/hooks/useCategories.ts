'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { blogService } from '../services/blog.service';
import { blogKeys } from '../utils/blog.keys';
import { MOCK_CATEGORIES } from '../data/mock-posts';
import { getErrorMessage } from '@/lib/api/api.types';
import type { CreateCategoryRequest } from '../types';

// Set to true to use mock data (for development without backend)
const USE_MOCK_DATA = true;

export function useCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 200));
        return MOCK_CATEGORIES;
      }
      return blogService.getCategories();
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => blogService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() });
      toast.success('Category created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
