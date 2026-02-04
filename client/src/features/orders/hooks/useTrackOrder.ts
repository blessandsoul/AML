'use client';

import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import { orderKeys } from '../utils/order.keys';
import { MOCK_ORDERS } from './useOrders';

// Use environment variable to toggle mock data
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export function useTrackOrder(code: string) {
  return useQuery({
    queryKey: orderKeys.track(code),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 500));
        const order = MOCK_ORDERS.find((o) => o.tracking_code === code);
        if (!order) throw new Error('Order not found');
        return order;
      }
      return orderService.trackOrder(code);
    },
    enabled: !!code,
    retry: false,
  });
}
