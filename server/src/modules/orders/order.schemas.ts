import { z } from 'zod';
import { paginationSchema } from '../../libs/pagination.js';

/**
 * Order status enum
 */
const orderStatusSchema = z.enum(['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED']);

// ============================================
// QUERY SCHEMAS
// ============================================

/**
 * Get orders query parameters (admin)
 */
export const getOrdersQuerySchema = paginationSchema.extend({
  status: orderStatusSchema.optional(),
  search: z.string().max(200).trim().optional(),
});

export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>;

/**
 * ID parameter schema
 */
export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export type IdParam = z.infer<typeof idParamSchema>;

/**
 * Tracking code parameter schema
 */
export const trackingCodeParamSchema = z.object({
  code: z
    .string()
    .min(1, 'Tracking code is required')
    .max(50, 'Tracking code is too long'),
});

export type TrackingCodeParam = z.infer<typeof trackingCodeParamSchema>;

// ============================================
// ORDER SCHEMAS
// ============================================

/**
 * Create order body schema
 */
export const createOrderSchema = z.object({
  car_make: z
    .string()
    .min(1, 'Car make is required')
    .max(100, 'Car make is too long')
    .trim(),
  car_model: z
    .string()
    .min(1, 'Car model is required')
    .max(100, 'Car model is too long')
    .trim(),
  car_year: z.coerce
    .number()
    .int()
    .min(1900, 'Car year must be at least 1900')
    .max(2100, 'Car year is too far in the future'),
  car_vin: z.string().max(50).trim().optional().nullable(),
  car_color: z.string().max(50).trim().optional().nullable(),
  car_image: z.string().url('Invalid image URL').optional().nullable(),
  auction_price: z.coerce.number().nonnegative('Auction price must be positive').optional().nullable(),
  shipping_cost: z.coerce.number().nonnegative('Shipping cost must be positive').optional().nullable(),
  total_price: z.coerce.number().nonnegative('Total price must be positive').optional().nullable(),
  customer_name: z
    .string()
    .min(1, 'Customer name is required')
    .max(200, 'Customer name is too long')
    .trim(),
  customer_phone: z.string().max(50).trim().optional().nullable(),
  customer_email: z.string().email('Invalid email address').optional().nullable(),
  auction_source: z.string().max(100).trim().optional().nullable(),
  lot_number: z.string().max(50).trim().optional().nullable(),
  origin_port: z.string().max(100).trim().optional().nullable(),
  destination_port: z.string().max(100).trim().optional().nullable(),
  vessel_name: z.string().max(100).trim().optional().nullable(),
  estimated_arrival: z.coerce.date().optional().nullable(),
});

export type CreateOrderBody = z.infer<typeof createOrderSchema>;

/**
 * Update order body schema
 */
export const updateOrderSchema = createOrderSchema.partial();

export type UpdateOrderBody = z.infer<typeof updateOrderSchema>;

/**
 * Update order status body schema
 */
export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
  note: z.string().max(1000).trim().optional().nullable(),
  location: z.string().max(200).trim().optional().nullable(),
  changed_by: z.string().max(200).trim().optional().nullable(),
});

export type UpdateOrderStatusBody = z.infer<typeof updateOrderStatusSchema>;
