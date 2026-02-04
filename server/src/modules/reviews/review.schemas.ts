import { z } from 'zod';
import { paginationSchema } from '../../libs/pagination.js';

// ============================================
// SHARED SCHEMAS
// ============================================

/**
 * Photo type enum for completed deals
 */
const photoTypeSchema = z.enum(['BEFORE', 'AFTER']);

/**
 * ID parameter schema
 */
export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export type IdParam = z.infer<typeof idParamSchema>;

// ============================================
// REVIEW QUERY SCHEMAS
// ============================================

/**
 * Get reviews query parameters (public)
 */
export const getReviewsQuerySchema = paginationSchema.extend({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  is_verified: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});

export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>;

/**
 * Get reviews query parameters (admin) - includes is_published filter
 */
export const getAdminReviewsQuerySchema = paginationSchema.extend({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  is_verified: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  is_published: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});

export type GetAdminReviewsQuery = z.infer<typeof getAdminReviewsQuerySchema>;

// ============================================
// REVIEW PHOTO SCHEMAS
// ============================================

/**
 * Review photo input schema
 */
const reviewPhotoSchema = z.object({
  url: z.string().url('Invalid photo URL'),
  alt_text: z.string().max(500).trim().optional().nullable(),
  sort_order: z.coerce.number().int().min(0).default(0),
});

// ============================================
// REVIEW BODY SCHEMAS
// ============================================

/**
 * Create review body schema
 */
export const createReviewSchema = z.object({
  customer_name: z
    .string()
    .min(1, 'Customer name is required')
    .max(200, 'Customer name is too long')
    .trim(),
  customer_city: z.string().max(100).trim().optional().nullable(),
  customer_avatar: z.string().url('Invalid avatar URL').optional().nullable(),
  rating: z.coerce.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  text: z
    .string()
    .min(1, 'Review text is required')
    .max(5000, 'Review text is too long')
    .trim(),
  car_make: z.string().max(100).trim().optional().nullable(),
  car_model: z.string().max(100).trim().optional().nullable(),
  car_year: z.coerce
    .number()
    .int()
    .min(1900, 'Car year must be at least 1900')
    .max(2100, 'Car year is too far in the future')
    .optional()
    .nullable(),
  is_verified: z.boolean().default(false),
  is_published: z.boolean().default(true),
  photos: z.array(reviewPhotoSchema).max(20, 'Maximum 20 photos allowed').optional(),
});

export type CreateReviewBody = z.infer<typeof createReviewSchema>;

/**
 * Update review body schema
 */
export const updateReviewSchema = createReviewSchema.partial();

export type UpdateReviewBody = z.infer<typeof updateReviewSchema>;

// ============================================
// COMPLETED DEAL QUERY SCHEMAS
// ============================================

/**
 * Get completed deals query parameters (public)
 */
export const getDealsQuerySchema = paginationSchema;

export type GetDealsQuery = z.infer<typeof getDealsQuerySchema>;

/**
 * Get completed deals query parameters (admin) - includes is_published filter
 */
export const getAdminDealsQuerySchema = paginationSchema.extend({
  is_published: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});

export type GetAdminDealsQuery = z.infer<typeof getAdminDealsQuerySchema>;

// ============================================
// COMPLETED DEAL PHOTO SCHEMAS
// ============================================

/**
 * Completed deal photo input schema
 */
const completedDealPhotoSchema = z.object({
  url: z.string().url('Invalid photo URL'),
  alt_text: z.string().max(500).trim().optional().nullable(),
  photo_type: photoTypeSchema.default('AFTER'),
  sort_order: z.coerce.number().int().min(0).default(0),
});

// ============================================
// COMPLETED DEAL BODY SCHEMAS
// ============================================

/**
 * Create completed deal body schema
 */
export const createCompletedDealSchema = z.object({
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
  auction_price: z.coerce.number().positive('Auction price must be positive'),
  market_price: z.coerce.number().positive('Market price must be positive'),
  savings: z.coerce.number(),
  delivery_city: z.string().max(100).trim().optional().nullable(),
  description: z.string().max(5000).trim().optional().nullable(),
  is_published: z.boolean().default(true),
  photos: z.array(completedDealPhotoSchema).max(20, 'Maximum 20 photos allowed').optional(),
});

export type CreateCompletedDealBody = z.infer<typeof createCompletedDealSchema>;

/**
 * Update completed deal body schema
 */
export const updateCompletedDealSchema = createCompletedDealSchema.partial();

export type UpdateCompletedDealBody = z.infer<typeof updateCompletedDealSchema>;
