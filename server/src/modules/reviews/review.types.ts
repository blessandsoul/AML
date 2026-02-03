import type { DealPhotoType } from '@prisma/client';

export type { DealPhotoType };

export interface Review {
  id: string;
  customer_name: string;
  customer_city: string | null;
  customer_avatar: string | null;
  rating: number;
  text: string;
  car_make: string | null;
  car_model: string | null;
  car_year: number | null;
  is_verified: boolean;
  is_published: boolean;
  photos: ReviewPhoto[];
  created_at: Date;
  updated_at: Date;
}

export interface ReviewPhoto {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  review_id: string;
}

export interface CompletedDeal {
  id: string;
  car_make: string;
  car_model: string;
  car_year: number;
  car_vin: string | null;
  auction_price: number;
  market_price: number;
  savings: number;
  delivery_city: string | null;
  description: string | null;
  is_published: boolean;
  photos: CompletedDealPhoto[];
  created_at: Date;
  updated_at: Date;
}

export interface CompletedDealPhoto {
  id: string;
  url: string;
  alt_text: string | null;
  photo_type: DealPhotoType;
  sort_order: number;
  deal_id: string;
}

export interface CreateReviewDto {
  customer_name: string;
  customer_city?: string;
  customer_avatar?: string;
  rating: number;
  text: string;
  car_make?: string;
  car_model?: string;
  car_year?: number;
  is_verified?: boolean;
  is_published?: boolean;
  photos?: { url: string; alt_text?: string; sort_order?: number }[];
}

export interface UpdateReviewDto {
  customer_name?: string;
  customer_city?: string | null;
  customer_avatar?: string | null;
  rating?: number;
  text?: string;
  car_make?: string | null;
  car_model?: string | null;
  car_year?: number | null;
  is_verified?: boolean;
  is_published?: boolean;
  photos?: { url: string; alt_text?: string; sort_order?: number }[];
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  rating?: number;
  is_verified?: boolean;
}

export interface CreateDealDto {
  car_make: string;
  car_model: string;
  car_year: number;
  car_vin?: string;
  auction_price: number;
  market_price: number;
  savings: number;
  delivery_city?: string;
  description?: string;
  is_published?: boolean;
  photos?: { url: string; alt_text?: string; photo_type?: DealPhotoType; sort_order?: number }[];
}

export interface UpdateDealDto {
  car_make?: string;
  car_model?: string;
  car_year?: number;
  car_vin?: string | null;
  auction_price?: number;
  market_price?: number;
  savings?: number;
  delivery_city?: string | null;
  description?: string | null;
  is_published?: boolean;
  photos?: { url: string; alt_text?: string; photo_type?: DealPhotoType; sort_order?: number }[];
}

export interface DealFilters {
  page?: number;
  limit?: number;
}

export interface AggregateRatingData {
  averageRating: number;
  totalReviews: number;
}
