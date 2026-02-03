import type { OrderFilters } from '../types';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  tracking: () => [...orderKeys.all, 'track'] as const,
  track: (code: string) => [...orderKeys.tracking(), code] as const,
};
