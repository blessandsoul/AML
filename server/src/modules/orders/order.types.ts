import type { OrderStatus } from '@prisma/client';

export type { OrderStatus };

export interface Order {
  id: string;
  order_number: string;
  tracking_code: string;
  car_make: string;
  car_model: string;
  car_year: number;
  car_vin: string | null;
  car_color: string | null;
  car_image: string | null;
  auction_price: number | null;
  shipping_cost: number | null;
  total_price: number | null;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  status: OrderStatus;
  current_stage: number;
  auction_source: string | null;
  lot_number: string | null;
  origin_port: string | null;
  destination_port: string | null;
  vessel_name: string | null;
  estimated_arrival: Date | null;
  status_history: OrderStatusHistory[];
  created_at: Date;
  updated_at: Date;
}

export interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  stage: number;
  note: string | null;
  location: string | null;
  changed_by: string | null;
  order_id: string;
  created_at: Date;
}

export interface CreateOrderDto {
  car_make: string;
  car_model: string;
  car_year: number;
  car_vin?: string;
  car_color?: string;
  car_image?: string;
  auction_price?: number;
  shipping_cost?: number;
  total_price?: number;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  status?: OrderStatus;
  auction_source?: string;
  lot_number?: string;
  origin_port?: string;
  destination_port?: string;
  vessel_name?: string;
  estimated_arrival?: string;
}

export interface UpdateOrderDto {
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

export interface UpdateStatusDto {
  status: OrderStatus;
  note?: string;
  location?: string;
  changed_by?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}
