import type { Prisma, CompletedDealPhotoType } from '@prisma/client';

// Decimal type from Prisma
type Decimal = Prisma.Decimal;

// ============================================
// REVIEW PHOTO
// ============================================

export interface ReviewPhotoEntity {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  reviewId: string;
}

// ============================================
// REVIEW
// ============================================

export interface ReviewEntity {
  id: string;
  customerName: string;
  customerCity: string | null;
  customerAvatar: string | null;
  rating: number;
  text: string;
  carMake: string | null;
  carModel: string | null;
  carYear: number | null;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithPhotos extends ReviewEntity {
  photos: ReviewPhotoEntity[];
}

export interface ReviewListItem {
  id: string;
  customerName: string;
  customerCity: string | null;
  customerAvatar: string | null;
  rating: number;
  text: string;
  carMake: string | null;
  carModel: string | null;
  carYear: number | null;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: Date;
  photos: ReviewPhotoEntity[];
}

// ============================================
// COMPLETED DEAL PHOTO
// ============================================

export interface CompletedDealPhotoEntity {
  id: string;
  url: string;
  altText: string | null;
  photoType: CompletedDealPhotoType;
  sortOrder: number;
  completedDealId: string;
}

// ============================================
// COMPLETED DEAL
// ============================================

export interface CompletedDealEntity {
  id: string;
  carMake: string;
  carModel: string;
  carYear: number;
  carVin: string | null;
  auctionPrice: Decimal;
  marketPrice: Decimal;
  savings: Decimal;
  deliveryCity: string | null;
  description: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompletedDealWithPhotos extends CompletedDealEntity {
  photos: CompletedDealPhotoEntity[];
}

export interface CompletedDealListItem {
  id: string;
  carMake: string;
  carModel: string;
  carYear: number;
  auctionPrice: Decimal;
  marketPrice: Decimal;
  savings: Decimal;
  deliveryCity: string | null;
  isPublished: boolean;
  createdAt: Date;
  photos: CompletedDealPhotoEntity[];
}

// ============================================
// INPUT TYPES
// ============================================

export interface ReviewPhotoInput {
  url: string;
  altText?: string | null;
  sortOrder?: number;
}

export interface CreateReviewInput {
  customerName: string;
  customerCity?: string | null;
  customerAvatar?: string | null;
  rating: number;
  text: string;
  carMake?: string | null;
  carModel?: string | null;
  carYear?: number | null;
  isVerified?: boolean;
  isPublished?: boolean;
  photos?: ReviewPhotoInput[];
}

export interface UpdateReviewInput {
  customerName?: string;
  customerCity?: string | null;
  customerAvatar?: string | null;
  rating?: number;
  text?: string;
  carMake?: string | null;
  carModel?: string | null;
  carYear?: number | null;
  isVerified?: boolean;
  isPublished?: boolean;
  photos?: ReviewPhotoInput[];
}

export interface CompletedDealPhotoInput {
  url: string;
  altText?: string | null;
  photoType?: CompletedDealPhotoType;
  sortOrder?: number;
}

export interface CreateCompletedDealInput {
  carMake: string;
  carModel: string;
  carYear: number;
  carVin?: string | null;
  auctionPrice: number;
  marketPrice: number;
  savings: number;
  deliveryCity?: string | null;
  description?: string | null;
  isPublished?: boolean;
  photos?: CompletedDealPhotoInput[];
}

export interface UpdateCompletedDealInput {
  carMake?: string;
  carModel?: string;
  carYear?: number;
  carVin?: string | null;
  auctionPrice?: number;
  marketPrice?: number;
  savings?: number;
  deliveryCity?: string | null;
  description?: string | null;
  isPublished?: boolean;
  photos?: CompletedDealPhotoInput[];
}

// ============================================
// QUERY PARAMS
// ============================================

export interface ReviewQueryParams {
  page: number;
  limit: number;
  rating?: number;
  isVerified?: boolean;
  isPublished?: boolean;
}

export interface CompletedDealQueryParams {
  page: number;
  limit: number;
  isPublished?: boolean;
}

// ============================================
// AGGREGATE TYPES
// ============================================

export interface AggregateRating {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
}

// ============================================
// RESPONSE TRANSFORMERS
// ============================================

export function toReviewResponse(review: ReviewWithPhotos) {
  return {
    id: review.id,
    customerName: review.customerName,
    customerCity: review.customerCity,
    customerAvatar: review.customerAvatar,
    rating: review.rating,
    text: review.text,
    car: review.carMake
      ? {
          make: review.carMake,
          model: review.carModel,
          year: review.carYear,
        }
      : null,
    isVerified: review.isVerified,
    isPublished: review.isPublished,
    photos: review.photos.map((p) => ({
      id: p.id,
      url: p.url,
      altText: p.altText,
      sortOrder: p.sortOrder,
    })),
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}

export function toReviewListItemResponse(review: ReviewListItem) {
  return {
    id: review.id,
    customerName: review.customerName,
    customerCity: review.customerCity,
    customerAvatar: review.customerAvatar,
    rating: review.rating,
    text: review.text,
    car: review.carMake
      ? {
          make: review.carMake,
          model: review.carModel,
          year: review.carYear,
        }
      : null,
    isVerified: review.isVerified,
    isPublished: review.isPublished,
    photos: review.photos.map((p) => ({
      id: p.id,
      url: p.url,
      altText: p.altText,
    })),
    createdAt: review.createdAt,
  };
}

export function toCompletedDealResponse(deal: CompletedDealWithPhotos) {
  return {
    id: deal.id,
    car: {
      make: deal.carMake,
      model: deal.carModel,
      year: deal.carYear,
      vin: deal.carVin,
    },
    pricing: {
      auctionPrice: Number(deal.auctionPrice),
      marketPrice: Number(deal.marketPrice),
      savings: Number(deal.savings),
    },
    deliveryCity: deal.deliveryCity,
    description: deal.description,
    isPublished: deal.isPublished,
    photos: deal.photos.map((p) => ({
      id: p.id,
      url: p.url,
      altText: p.altText,
      photoType: p.photoType,
      sortOrder: p.sortOrder,
    })),
    createdAt: deal.createdAt,
    updatedAt: deal.updatedAt,
  };
}

export function toCompletedDealListItemResponse(deal: CompletedDealListItem) {
  return {
    id: deal.id,
    car: {
      make: deal.carMake,
      model: deal.carModel,
      year: deal.carYear,
    },
    pricing: {
      auctionPrice: Number(deal.auctionPrice),
      marketPrice: Number(deal.marketPrice),
      savings: Number(deal.savings),
    },
    deliveryCity: deal.deliveryCity,
    isPublished: deal.isPublished,
    photos: deal.photos.map((p) => ({
      id: p.id,
      url: p.url,
      photoType: p.photoType,
    })),
    createdAt: deal.createdAt,
  };
}

export function toAggregateRatingResponse(aggregate: AggregateRating) {
  return {
    averageRating: aggregate.averageRating,
    totalReviews: aggregate.totalReviews,
    ratingDistribution: aggregate.ratingDistribution,
  };
}
