'use client';

import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import { orderKeys } from '../utils/order.keys';
import { MOCK_ORDERS } from './useOrders';

const USE_MOCK_DATA = true;

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 300));
        const order = MOCK_ORDERS.find((o) => o.id === id);
        if (!order) throw new Error('Order not found');
        return order;
      }
      return orderService.getOrderById(id);
    },
    enabled: !!id,
  });
}
