'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import { orderKeys } from '../utils/order.keys';
import type { Order, OrderStatus } from '../types';

// ===== Types =====

export interface CreateOrderData {
  order_number: string;
  tracking_code: string;
  car_make: string;
  car_model: string;
  car_year: number;
  car_vin?: string | null;
  car_color?: string | null;
  car_image?: string | null;
  auction_price?: number | null;
  shipping_cost?: number | null;
  total_price?: number | null;
  customer_name: string;
  customer_phone?: string | null;
  customer_email?: string | null;
  status?: OrderStatus;
  auction_source?: string | null;
  lot_number?: string | null;
  origin_port?: string | null;
  destination_port?: string | null;
  vessel_name?: string | null;
  estimated_arrival?: string | null;
}

export interface UpdateOrderData {
  order_number?: string;
  tracking_code?: string;
  car_make?: string;
  car_model?: string;
  car_year?: number;
  car_vin?: string | null;
  car_color?: string | null;
  car_image?: string | null;
  auction_price?: number | null;
  shipping_cost?: number | null;
  total_price?: number | null;
  customer_name?: string;
  customer_phone?: string | null;
  customer_email?: string | null;
  auction_source?: string | null;
  lot_number?: string | null;
  origin_port?: string | null;
  destination_port?: string | null;
  vessel_name?: string | null;
  estimated_arrival?: string | null;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  note?: string;
  location?: string;
  changed_by?: string;
}

// ===== Hooks =====

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success('შეკვეთა წარმატებით შეიქმნა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderData }) =>
      orderService.updateOrder(id, data),
    onSuccess: (updatedOrder: Order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(updatedOrder.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('შეკვეთა წარმატებით განახლდა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusData }) =>
      orderService.updateOrderStatus(id, data),
    onSuccess: (updatedOrder: Order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(updatedOrder.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      if (updatedOrder.tracking_code) {
        queryClient.invalidateQueries({ queryKey: orderKeys.track(updatedOrder.tracking_code) });
      }
      toast.success('სტატუსი წარმატებით განახლდა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success('შეკვეთა წარმატებით წაიშალა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
