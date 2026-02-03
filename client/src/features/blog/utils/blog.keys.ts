import type { PostFilters } from '../types';

export const blogKeys = {
  all: ['blog'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (filters: PostFilters) => [...blogKeys.lists(), filters] as const,
  adminLists: () => [...blogKeys.all, 'admin-list'] as const,
  adminList: (filters: PostFilters) => [...blogKeys.adminLists(), filters] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (slug: string) => [...blogKeys.details(), slug] as const,
  detailById: (id: string) => [...blogKeys.details(), 'id', id] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  tags: () => [...blogKeys.all, 'tags'] as const,
};
