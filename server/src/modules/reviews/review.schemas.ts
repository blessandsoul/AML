import { z } from 'zod';

// ===== REVIEW SCHEMAS =====

const ReviewPhotoSchema = z.object({
  url: z.string().url('Invalid photo URL'),
  alt_text: z.string().max(255).optional(),
  sort_order: z.number().int().min(0).default(0).optional(),
});

export const CreateReviewSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required').max(100),
  customer_city: z.string().max(100).optional(),
  customer_avatar: z.string().url().optional(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  text: z.string().min(1, 'Review text is required'),
  car_make: z.string().max(100).optional(),
  car_model: z.string().max(100).optional(),
  car_year: z.number().int().min(1900).max(2100).optional(),
  is_verified: z.boolean().optional(),
  is_published: z.boolean().optional(),
  photos: z.array(ReviewPhotoSchema).max(10).optional(),
});

export const UpdateReviewSchema = z.object({
  customer_name: z.string().min(1).max(100).optional(),
  customer_city: z.string().max(100).optional().nullable(),
  customer_avatar: z.string().url().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional(),
  text: z.string().min(1).optional(),
  car_make: z.string().max(100).optional().nullable(),
  car_model: z.string().max(100).optional().nullable(),
  car_year: z.number().int().min(1900).max(2100).optional().nullable(),
  is_verified: z.boolean().optional(),
  is_published: z.boolean().optional(),
  photos: z.array(ReviewPhotoSchema).max(10).optional(),
});

export const ReviewFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  is_verified: z.coerce.boolean().optional(),
});

// ===== DEAL SCHEMAS =====

const DealPhotoSchema = z.object({
  url: z.string().url('Invalid photo URL'),
  alt_text: z.string().max(255).optional(),
  photo_type: z.enum(['BEFORE', 'AFTER']).optional(),
  sort_order: z.number().int().min(0).default(0).optional(),
});

export const CreateDealSchema = z.object({
  car_make: z.string().min(1, 'Car make is required').max(100),
  car_model: z.string().min(1, 'Car model is required').max(100),
  car_year: z.number().int().min(1900).max(2100),
  car_vin: z.string().max(17).optional(),
  auction_price: z.number().positive('Auction price must be positive'),
  market_price: z.number().positive('Market price must be positive'),
  savings: z.number().positive('Savings must be positive'),
  delivery_city: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  is_published: z.boolean().optional(),
  photos: z.array(DealPhotoSchema).max(20).optional(),
});

export const UpdateDealSchema = z.object({
  car_make: z.string().min(1).max(100).optional(),
  car_model: z.string().min(1).max(100).optional(),
  car_year: z.number().int().min(1900).max(2100).optional(),
  car_vin: z.string().max(17).optional().nullable(),
  auction_price: z.number().positive().optional(),
  market_price: z.number().positive().optional(),
  savings: z.number().positive().optional(),
  delivery_city: z.string().max(100).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  is_published: z.boolean().optional(),
  photos: z.array(DealPhotoSchema).max(20).optional(),
});

export const DealFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
});

// ===== INFERRED TYPES =====

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewSchema>;
export type ReviewFiltersInput = z.infer<typeof ReviewFiltersSchema>;
export type CreateDealInput = z.infer<typeof CreateDealSchema>;
export type UpdateDealInput = z.infer<typeof UpdateDealSchema>;
export type DealFiltersInput = z.infer<typeof DealFiltersSchema>;
