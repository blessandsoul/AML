import { prisma } from '../../libs/prisma.js';
import { calculateOffset } from '../../libs/pagination.js';
import type { Prisma, CompletedDealPhotoType } from '@prisma/client';
import type {
  ReviewWithPhotos,
  ReviewListItem,
  CreateReviewInput,
  UpdateReviewInput,
  ReviewQueryParams,
  CompletedDealWithPhotos,
  CompletedDealListItem,
  CreateCompletedDealInput,
  UpdateCompletedDealInput,
  CompletedDealQueryParams,
  AggregateRating,
} from './review.types.js';

// ============================================
// SELECTION OBJECTS
// ============================================

/**
 * Selection for review list items
 */
const reviewListSelect = {
  id: true,
  customerName: true,
  customerCity: true,
  customerAvatar: true,
  rating: true,
  text: true,
  carMake: true,
  carModel: true,
  carYear: true,
  isVerified: true,
  isPublished: true,
  createdAt: true,
  photos: {
    select: {
      id: true,
      url: true,
      altText: true,
      sortOrder: true,
      reviewId: true,
    },
    orderBy: {
      sortOrder: 'asc' as const,
    },
  },
} as const;

/**
 * Selection for full review details
 */
const reviewDetailSelect = {
  id: true,
  customerName: true,
  customerCity: true,
  customerAvatar: true,
  rating: true,
  text: true,
  carMake: true,
  carModel: true,
  carYear: true,
  isVerified: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
  photos: {
    select: {
      id: true,
      url: true,
      altText: true,
      sortOrder: true,
      reviewId: true,
    },
    orderBy: {
      sortOrder: 'asc' as const,
    },
  },
} as const;

/**
 * Selection for completed deal list items
 */
const dealListSelect = {
  id: true,
  carMake: true,
  carModel: true,
  carYear: true,
  auctionPrice: true,
  marketPrice: true,
  savings: true,
  deliveryCity: true,
  isPublished: true,
  createdAt: true,
  photos: {
    select: {
      id: true,
      url: true,
      altText: true,
      photoType: true,
      sortOrder: true,
      completedDealId: true,
    },
    orderBy: {
      sortOrder: 'asc' as const,
    },
  },
} as const;

/**
 * Selection for full completed deal details
 */
const dealDetailSelect = {
  id: true,
  carMake: true,
  carModel: true,
  carYear: true,
  carVin: true,
  auctionPrice: true,
  marketPrice: true,
  savings: true,
  deliveryCity: true,
  description: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
  photos: {
    select: {
      id: true,
      url: true,
      altText: true,
      photoType: true,
      sortOrder: true,
      completedDealId: true,
    },
    orderBy: {
      sortOrder: 'asc' as const,
    },
  },
} as const;

// ============================================
// REVIEW REPOSITORY
// ============================================

export const reviewRepo = {
  // ============================================
  // REVIEWS
  // ============================================

  /**
   * Find reviews with pagination and filters
   */
  async findReviews(
    params: ReviewQueryParams
  ): Promise<{ items: ReviewListItem[]; totalItems: number }> {
    const { page, limit, rating, isVerified, isPublished } = params;
    const offset = calculateOffset(page, limit);

    // Build where clause
    const where: Prisma.ReviewWhereInput = {};

    // Rating filter
    if (rating !== undefined) {
      where.rating = rating;
    }

    // Verified filter
    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }

    // Published filter
    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    // Execute queries in parallel
    const [items, totalItems] = await Promise.all([
      prisma.review.findMany({
        where,
        select: reviewListSelect,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return { items: items as unknown as ReviewListItem[], totalItems };
  },

  /**
   * Find review by ID
   */
  async findReviewById(id: string): Promise<ReviewWithPhotos | null> {
    const review = await prisma.review.findUnique({
      where: { id },
      select: reviewDetailSelect,
    });

    return review as unknown as ReviewWithPhotos | null;
  },

  /**
   * Create a new review
   */
  async createReview(data: CreateReviewInput): Promise<ReviewWithPhotos> {
    const review = await prisma.review.create({
      data: {
        customerName: data.customerName,
        customerCity: data.customerCity,
        customerAvatar: data.customerAvatar,
        rating: data.rating,
        text: data.text,
        carMake: data.carMake,
        carModel: data.carModel,
        carYear: data.carYear,
        isVerified: data.isVerified ?? false,
        isPublished: data.isPublished ?? true,
        photos: data.photos
          ? {
              create: data.photos.map((photo, index) => ({
                url: photo.url,
                altText: photo.altText,
                sortOrder: photo.sortOrder ?? index,
              })),
            }
          : undefined,
      },
      select: reviewDetailSelect,
    });

    return review as unknown as ReviewWithPhotos;
  },

  /**
   * Update a review
   */
  async updateReview(
    id: string,
    data: UpdateReviewInput
  ): Promise<ReviewWithPhotos> {
    // If photos are provided, we need to replace them
    if (data.photos !== undefined) {
      // Delete existing photos and create new ones in a transaction
      await prisma.$transaction(async (tx) => {
        await tx.reviewPhoto.deleteMany({ where: { reviewId: id } });
        if (data.photos && data.photos.length > 0) {
          await tx.reviewPhoto.createMany({
            data: data.photos.map((photo, index) => ({
              reviewId: id,
              url: photo.url,
              altText: photo.altText,
              sortOrder: photo.sortOrder ?? index,
            })),
          });
        }
      });
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        customerName: data.customerName,
        customerCity: data.customerCity,
        customerAvatar: data.customerAvatar,
        rating: data.rating,
        text: data.text,
        carMake: data.carMake,
        carModel: data.carModel,
        carYear: data.carYear,
        isVerified: data.isVerified,
        isPublished: data.isPublished,
      },
      select: reviewDetailSelect,
    });

    return review as unknown as ReviewWithPhotos;
  },

  /**
   * Delete a review
   */
  async deleteReview(id: string): Promise<void> {
    await prisma.review.delete({
      where: { id },
    });
  },

  /**
   * Get aggregate rating statistics
   */
  async getAggregateRating(): Promise<AggregateRating> {
    // Get average and count
    const aggregates = await prisma.review.aggregate({
      where: { isPublished: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // Get rating distribution
    const distribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { isPublished: true },
      _count: { rating: true },
    });

    // Build distribution array with all ratings (1-5)
    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => {
      const found = distribution.find((d) => d.rating === rating);
      return {
        rating,
        count: found?._count.rating ?? 0,
      };
    });

    return {
      averageRating: aggregates._avg.rating ?? 0,
      totalReviews: aggregates._count.rating,
      ratingDistribution,
    };
  },

  // ============================================
  // COMPLETED DEALS
  // ============================================

  /**
   * Find completed deals with pagination and filters
   */
  async findDeals(
    params: CompletedDealQueryParams
  ): Promise<{ items: CompletedDealListItem[]; totalItems: number }> {
    const { page, limit, isPublished } = params;
    const offset = calculateOffset(page, limit);

    // Build where clause
    const where: Prisma.CompletedDealWhereInput = {};

    // Published filter
    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    // Execute queries in parallel
    const [items, totalItems] = await Promise.all([
      prisma.completedDeal.findMany({
        where,
        select: dealListSelect,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.completedDeal.count({ where }),
    ]);

    return { items: items as unknown as CompletedDealListItem[], totalItems };
  },

  /**
   * Find completed deal by ID
   */
  async findDealById(id: string): Promise<CompletedDealWithPhotos | null> {
    const deal = await prisma.completedDeal.findUnique({
      where: { id },
      select: dealDetailSelect,
    });

    return deal as unknown as CompletedDealWithPhotos | null;
  },

  /**
   * Create a new completed deal
   */
  async createDeal(data: CreateCompletedDealInput): Promise<CompletedDealWithPhotos> {
    const deal = await prisma.completedDeal.create({
      data: {
        carMake: data.carMake,
        carModel: data.carModel,
        carYear: data.carYear,
        carVin: data.carVin,
        auctionPrice: data.auctionPrice,
        marketPrice: data.marketPrice,
        savings: data.savings,
        deliveryCity: data.deliveryCity,
        description: data.description,
        isPublished: data.isPublished ?? true,
        photos: data.photos
          ? {
              create: data.photos.map((photo, index) => ({
                url: photo.url,
                altText: photo.altText,
                photoType: photo.photoType ?? 'AFTER',
                sortOrder: photo.sortOrder ?? index,
              })),
            }
          : undefined,
      },
      select: dealDetailSelect,
    });

    return deal as unknown as CompletedDealWithPhotos;
  },

  /**
   * Update a completed deal
   */
  async updateDeal(
    id: string,
    data: UpdateCompletedDealInput
  ): Promise<CompletedDealWithPhotos> {
    // If photos are provided, we need to replace them
    if (data.photos !== undefined) {
      // Delete existing photos and create new ones in a transaction
      await prisma.$transaction(async (tx) => {
        await tx.completedDealPhoto.deleteMany({ where: { completedDealId: id } });
        if (data.photos && data.photos.length > 0) {
          await tx.completedDealPhoto.createMany({
            data: data.photos.map((photo, index) => ({
              completedDealId: id,
              url: photo.url,
              altText: photo.altText,
              photoType: (photo.photoType ?? 'AFTER') as CompletedDealPhotoType,
              sortOrder: photo.sortOrder ?? index,
            })),
          });
        }
      });
    }

    const deal = await prisma.completedDeal.update({
      where: { id },
      data: {
        carMake: data.carMake,
        carModel: data.carModel,
        carYear: data.carYear,
        carVin: data.carVin,
        auctionPrice: data.auctionPrice,
        marketPrice: data.marketPrice,
        savings: data.savings,
        deliveryCity: data.deliveryCity,
        description: data.description,
        isPublished: data.isPublished,
      },
      select: dealDetailSelect,
    });

    return deal as unknown as CompletedDealWithPhotos;
  },

  /**
   * Delete a completed deal
   */
  async deleteDeal(id: string): Promise<void> {
    await prisma.completedDeal.delete({
      where: { id },
    });
  },
};
