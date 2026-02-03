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
  created_at: string;
  updated_at: string;
}

export interface ReviewPhoto {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
}

export type DealPhotoType = 'BEFORE' | 'AFTER';

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
  created_at: string;
  updated_at: string;
}

export interface CompletedDealPhoto {
  id: string;
  url: string;
  alt_text: string | null;
  photo_type: DealPhotoType;
  sort_order: number;
}

export interface AggregateRating {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  rating?: number;
  is_verified?: boolean;
}

export interface DealFilters {
  page?: number;
  limit?: number;
}
