import { reviewRepo } from './review.repo.js';
import { NotFoundError, BadRequestError } from '../../libs/errors.js';
import type { PaginatedResult } from '../../libs/pagination.js';
import type {
  ReviewWithPhotos,
  ReviewListItem,
  CreateReviewInput,
  UpdateReviewInput,
  CompletedDealWithPhotos,
  CompletedDealListItem,
  CreateCompletedDealInput,
  UpdateCompletedDealInput,
  AggregateRating,
} from './review.types.js';

/**
 * Review Service - Business logic for reviews module
 */
export const reviewService = {
  // ============================================
  // REVIEWS
  // ============================================

  /**
   * Get reviews (public - only published)
   */
  async getReviews(params: {
    page: number;
    limit: number;
    rating?: number;
    isVerified?: boolean;
  }): Promise<PaginatedResult<ReviewListItem>> {
    // Public endpoint: always filter by isPublished = true
    return reviewRepo.findReviews({
      ...params,
      isPublished: true,
    });
  },

  /**
   * Get reviews for admin (includes unpublished)
   */
  async getAdminReviews(params: {
    page: number;
    limit: number;
    rating?: number;
    isVerified?: boolean;
    isPublished?: boolean;
  }): Promise<PaginatedResult<ReviewListItem>> {
    return reviewRepo.findReviews(params);
  },

  /**
   * Get review by ID
   */
  async getReviewById(id: string): Promise<ReviewWithPhotos> {
    const review = await reviewRepo.findReviewById(id);

    if (!review) {
      throw new NotFoundError('Review', 'REVIEW_NOT_FOUND');
    }

    return review;
  },

  /**
   * Create a new review
   */
  async createReview(data: CreateReviewInput): Promise<ReviewWithPhotos> {
    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestError('Rating must be between 1 and 5', 'INVALID_RATING');
    }

    // Validate car year if provided
    if (data.carYear) {
      const currentYear = new Date().getFullYear();
      if (data.carYear > currentYear + 1) {
        throw new BadRequestError(
          'Car year cannot be more than 1 year in the future',
          'INVALID_CAR_YEAR'
        );
      }
    }

    return reviewRepo.createReview(data);
  },

  /**
   * Update a review
   */
  async updateReview(
    id: string,
    data: UpdateReviewInput
  ): Promise<ReviewWithPhotos> {
    // Check if review exists
    const existingReview = await reviewRepo.findReviewById(id);
    if (!existingReview) {
      throw new NotFoundError('Review', 'REVIEW_NOT_FOUND');
    }

    // Validate rating range if provided
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new BadRequestError('Rating must be between 1 and 5', 'INVALID_RATING');
    }

    // Validate car year if provided
    if (data.carYear) {
      const currentYear = new Date().getFullYear();
      if (data.carYear > currentYear + 1) {
        throw new BadRequestError(
          'Car year cannot be more than 1 year in the future',
          'INVALID_CAR_YEAR'
        );
      }
    }

    return reviewRepo.updateReview(id, data);
  },

  /**
   * Delete a review
   */
  async deleteReview(id: string): Promise<void> {
    const review = await reviewRepo.findReviewById(id);
    if (!review) {
      throw new NotFoundError('Review', 'REVIEW_NOT_FOUND');
    }

    await reviewRepo.deleteReview(id);
  },

  /**
   * Get aggregate rating statistics
   */
  async getAggregateRating(): Promise<AggregateRating> {
    return reviewRepo.getAggregateRating();
  },

  // ============================================
  // COMPLETED DEALS
  // ============================================

  /**
   * Get completed deals (public - only published)
   */
  async getDeals(params: {
    page: number;
    limit: number;
  }): Promise<PaginatedResult<CompletedDealListItem>> {
    // Public endpoint: always filter by isPublished = true
    return reviewRepo.findDeals({
      ...params,
      isPublished: true,
    });
  },

  /**
   * Get completed deals for admin (includes unpublished)
   */
  async getAdminDeals(params: {
    page: number;
    limit: number;
    isPublished?: boolean;
  }): Promise<PaginatedResult<CompletedDealListItem>> {
    return reviewRepo.findDeals(params);
  },

  /**
   * Get completed deal by ID
   */
  async getDealById(id: string): Promise<CompletedDealWithPhotos> {
    const deal = await reviewRepo.findDealById(id);

    if (!deal) {
      throw new NotFoundError('Completed deal', 'DEAL_NOT_FOUND');
    }

    return deal;
  },

  /**
   * Create a new completed deal
   */
  async createDeal(data: CreateCompletedDealInput): Promise<CompletedDealWithPhotos> {
    // Validate car year
    const currentYear = new Date().getFullYear();
    if (data.carYear > currentYear + 1) {
      throw new BadRequestError(
        'Car year cannot be more than 1 year in the future',
        'INVALID_CAR_YEAR'
      );
    }

    // Validate pricing
    if (data.auctionPrice <= 0) {
      throw new BadRequestError('Auction price must be positive', 'INVALID_PRICE');
    }
    if (data.marketPrice <= 0) {
      throw new BadRequestError('Market price must be positive', 'INVALID_PRICE');
    }

    // Calculate savings if not provided or validate
    const expectedSavings = data.marketPrice - data.auctionPrice;
    if (Math.abs(data.savings - expectedSavings) > 1) {
      // Allow small rounding differences
      // Could either auto-calculate or throw error
      // For now, trust the provided value
    }

    return reviewRepo.createDeal(data);
  },

  /**
   * Update a completed deal
   */
  async updateDeal(
    id: string,
    data: UpdateCompletedDealInput
  ): Promise<CompletedDealWithPhotos> {
    // Check if deal exists
    const existingDeal = await reviewRepo.findDealById(id);
    if (!existingDeal) {
      throw new NotFoundError('Completed deal', 'DEAL_NOT_FOUND');
    }

    // Validate car year if provided
    if (data.carYear) {
      const currentYear = new Date().getFullYear();
      if (data.carYear > currentYear + 1) {
        throw new BadRequestError(
          'Car year cannot be more than 1 year in the future',
          'INVALID_CAR_YEAR'
        );
      }
    }

    // Validate pricing if provided
    if (data.auctionPrice !== undefined && data.auctionPrice <= 0) {
      throw new BadRequestError('Auction price must be positive', 'INVALID_PRICE');
    }
    if (data.marketPrice !== undefined && data.marketPrice <= 0) {
      throw new BadRequestError('Market price must be positive', 'INVALID_PRICE');
    }

    return reviewRepo.updateDeal(id, data);
  },

  /**
   * Delete a completed deal
   */
  async deleteDeal(id: string): Promise<void> {
    const deal = await reviewRepo.findDealById(id);
    if (!deal) {
      throw new NotFoundError('Completed deal', 'DEAL_NOT_FOUND');
    }

    await reviewRepo.deleteDeal(id);
  },
};
