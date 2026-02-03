import type { ReviewFilters, DealFilters } from '../types';

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters: ReviewFilters) => [...reviewKeys.lists(), filters] as const,
  aggregate: () => [...reviewKeys.all, 'aggregate'] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
  deals: () => [...reviewKeys.all, 'deals'] as const,
  dealList: (filters: DealFilters) => [...reviewKeys.deals(), 'list', filters] as const,
  dealDetail: (id: string) => [...reviewKeys.deals(), 'detail', id] as const,
};
