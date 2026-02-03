import { z } from 'zod';

export const CreateOrderSchema = z.object({
  car_make: z.string().min(1, 'Car make is required').max(100),
  car_model: z.string().min(1, 'Car model is required').max(100),
  car_year: z.coerce.number().int().min(1900).max(2100),
  car_vin: z.string().max(50).optional(),
  car_color: z.string().max(50).optional(),
  car_image: z.string().url().optional().or(z.literal('')),
  auction_price: z.coerce.number().min(0).optional(),
  shipping_cost: z.coerce.number().min(0).optional(),
  total_price: z.coerce.number().min(0).optional(),
  customer_name: z.string().min(1, 'Customer name is required').max(100),
  customer_phone: z.string().max(50).optional(),
  customer_email: z.string().email().optional().or(z.literal('')),
  status: z.enum(['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED']).optional(),
  auction_source: z.string().max(100).optional(),
  lot_number: z.string().max(50).optional(),
  origin_port: z.string().max(100).optional(),
  destination_port: z.string().max(100).optional(),
  vessel_name: z.string().max(100).optional(),
  estimated_arrival: z.string().datetime().optional(),
});

export const UpdateOrderSchema = z.object({
  car_make: z.string().min(1).max(100).optional(),
  car_model: z.string().min(1).max(100).optional(),
  car_year: z.coerce.number().int().min(1900).max(2100).optional(),
  car_vin: z.string().max(50).optional().nullable(),
  car_color: z.string().max(50).optional().nullable(),
  car_image: z.string().url().optional().nullable().or(z.literal('')),
  auction_price: z.coerce.number().min(0).optional().nullable(),
  shipping_cost: z.coerce.number().min(0).optional().nullable(),
  total_price: z.coerce.number().min(0).optional().nullable(),
  customer_name: z.string().min(1).max(100).optional(),
  customer_phone: z.string().max(50).optional().nullable(),
  customer_email: z.string().email().optional().nullable().or(z.literal('')),
  auction_source: z.string().max(100).optional().nullable(),
  lot_number: z.string().max(50).optional().nullable(),
  origin_port: z.string().max(100).optional().nullable(),
  destination_port: z.string().max(100).optional().nullable(),
  vessel_name: z.string().max(100).optional().nullable(),
  estimated_arrival: z.string().datetime().optional().nullable(),
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED']),
  note: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  changed_by: z.string().max(100).optional(),
});

export const OrderFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED']).optional(),
  search: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;
export type OrderFiltersInput = z.infer<typeof OrderFiltersSchema>;
