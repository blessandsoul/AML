export interface ReviewPhoto {
  id: string;
  url: string;
  altText: string | null;
  sortOrder?: number;
}

export interface ReviewCar {
  make: string;
  model: string;
  year: number;
}

export interface Review {
  id: string;
  customerName: string;
  customerCity: string | null;
  customerAvatar: string | null;
  rating: number;
  text: string;
  car: ReviewCar | null;
  isVerified: boolean;
  isPublished: boolean;
  photos: ReviewPhoto[];
  createdAt: string;
  updatedAt?: string;
}

export type DealPhotoType = 'BEFORE' | 'AFTER';

export interface CompletedDealPhoto {
  id: string;
  url: string;
  altText?: string | null;
  photoType: DealPhotoType;
  sortOrder?: number;
}

export interface DealCar {
  make: string;
  model: string;
  year: number;
}

export interface DealPricing {
  auctionPrice: number;
  marketPrice: number;
  savings: number;
}

export interface CompletedDeal {
  id: string;
  car: DealCar;
  pricing: DealPricing;
  deliveryCity: string | null;
  description?: string | null;
  isPublished: boolean;
  photos: CompletedDealPhoto[];
  createdAt: string;
  updatedAt?: string;
}

export interface AggregateRating {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  rating?: number;
  isVerified?: boolean;
}

export interface DealFilters {
  page?: number;
  limit?: number;
}

// For mutations
export interface CreateReviewData {
  customerName: string;
  customerCity?: string;
  rating: number;
  text: string;
  carMake?: string;
  carModel?: string;
  carYear?: number;
}

export interface UpdateReviewData {
  customerName?: string;
  customerCity?: string;
  rating?: number;
  text?: string;
  isPublished?: boolean;
}

export interface CreateDealData {
  carMake: string;
  carModel: string;
  carYear: number;
  auctionPrice: number;
  marketPrice: number;
  deliveryCity?: string;
  description?: string;
}

export interface UpdateDealData {
  carMake?: string;
  carModel?: string;
  carYear?: number;
  auctionPrice?: number;
  marketPrice?: number;
  deliveryCity?: string;
  description?: string;
  isPublished?: boolean;
}
