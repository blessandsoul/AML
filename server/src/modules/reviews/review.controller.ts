import type { FastifyRequest, FastifyReply } from 'fastify';
import { reviewService } from './review.service.js';
import {
  getReviewsQuerySchema,
  getAdminReviewsQuerySchema,
  getDealsQuerySchema,
  getAdminDealsQuerySchema,
  idParamSchema,
  createReviewSchema,
  updateReviewSchema,
  createCompletedDealSchema,
  updateCompletedDealSchema,
} from './review.schemas.js';
import { successResponse, paginatedResponse } from '../../libs/response.js';
import { ValidationError } from '../../libs/errors.js';
import {
  toReviewResponse,
  toReviewListItemResponse,
  toCompletedDealResponse,
  toCompletedDealListItemResponse,
  toAggregateRatingResponse,
} from './review.types.js';

/**
 * Review Controller - HTTP request handlers
 */
export const reviewController = {
  // ============================================
  // PUBLIC - REVIEWS
  // ============================================

  /**
   * Get reviews (public - only published)
   * GET /reviews
   */
  async getReviews(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = getReviewsQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { page, limit, rating, is_verified } = parsed.data;

    const result = await reviewService.getReviews({
      page,
      limit,
      rating,
      isVerified: is_verified,
    });

    return reply.send(
      paginatedResponse(
        'Reviews retrieved successfully',
        result.items.map(toReviewListItemResponse),
        page,
        limit,
        result.totalItems
      )
    );
  },

  /**
   * Get aggregate rating (public)
   * GET /reviews/aggregate
   */
  async getAggregateRating(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const aggregate = await reviewService.getAggregateRating();

    return reply.send(
      successResponse('Aggregate rating retrieved successfully', toAggregateRatingResponse(aggregate))
    );
  },

  // ============================================
  // PUBLIC - COMPLETED DEALS
  // ============================================

  /**
   * Get completed deals (public - only published)
   * GET /reviews/deals
   */
  async getDeals(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = getDealsQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { page, limit } = parsed.data;

    const result = await reviewService.getDeals({ page, limit });

    return reply.send(
      paginatedResponse(
        'Completed deals retrieved successfully',
        result.items.map(toCompletedDealListItemResponse),
        page,
        limit,
        result.totalItems
      )
    );
  },

  // ============================================
  // ADMIN - REVIEWS
  // ============================================

  /**
   * Get all reviews (admin - includes unpublished)
   * GET /reviews/admin/reviews
   */
  async getAdminReviews(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = getAdminReviewsQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { page, limit, rating, is_verified, is_published } = parsed.data;

    const result = await reviewService.getAdminReviews({
      page,
      limit,
      rating,
      isVerified: is_verified,
      isPublished: is_published,
    });

    return reply.send(
      paginatedResponse(
        'Reviews retrieved successfully',
        result.items.map(toReviewListItemResponse),
        page,
        limit,
        result.totalItems
      )
    );
  },

  /**
   * Get review by ID (admin)
   * GET /reviews/admin/reviews/:id
   */
  async getReviewById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = idParamSchema.safeParse(request.params);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const review = await reviewService.getReviewById(parsed.data.id);

    return reply.send(
      successResponse('Review retrieved successfully', toReviewResponse(review))
    );
  },

  /**
   * Create a new review (admin)
   * POST /reviews/admin/reviews
   */
  async createReview(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = createReviewSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const {
      customer_name,
      customer_city,
      customer_avatar,
      rating,
      text,
      car_make,
      car_model,
      car_year,
      is_verified,
      is_published,
      photos,
    } = parsed.data;

    const review = await reviewService.createReview({
      customerName: customer_name,
      customerCity: customer_city,
      customerAvatar: customer_avatar,
      rating,
      text,
      carMake: car_make,
      carModel: car_model,
      carYear: car_year,
      isVerified: is_verified,
      isPublished: is_published,
      photos: photos?.map((p) => ({
        url: p.url,
        altText: p.alt_text,
        sortOrder: p.sort_order,
      })),
    });

    return reply.status(201).send(
      successResponse('Review created successfully', toReviewResponse(review))
    );
  },

  /**
   * Update a review (admin)
   * PATCH /reviews/admin/reviews/:id
   */
  async updateReview(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const paramsParsed = idParamSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      throw new ValidationError(
        'Validation failed',
        paramsParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const bodyParsed = updateReviewSchema.safeParse(request.body);
    if (!bodyParsed.success) {
      throw new ValidationError(
        'Validation failed',
        bodyParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { id } = paramsParsed.data;
    const {
      customer_name,
      customer_city,
      customer_avatar,
      rating,
      text,
      car_make,
      car_model,
      car_year,
      is_verified,
      is_published,
      photos,
    } = bodyParsed.data;

    const review = await reviewService.updateReview(id, {
      customerName: customer_name,
      customerCity: customer_city,
      customerAvatar: customer_avatar,
      rating,
      text,
      carMake: car_make,
      carModel: car_model,
      carYear: car_year,
      isVerified: is_verified,
      isPublished: is_published,
      photos: photos?.map((p) => ({
        url: p.url,
        altText: p.alt_text,
        sortOrder: p.sort_order,
      })),
    });

    return reply.send(
      successResponse('Review updated successfully', toReviewResponse(review))
    );
  },

  /**
   * Delete a review (admin)
   * DELETE /reviews/admin/reviews/:id
   */
  async deleteReview(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = idParamSchema.safeParse(request.params);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    await reviewService.deleteReview(parsed.data.id);

    return reply.send(
      successResponse('Review deleted successfully', null)
    );
  },

  // ============================================
  // ADMIN - COMPLETED DEALS
  // ============================================

  /**
   * Get all completed deals (admin - includes unpublished)
   * GET /reviews/admin/deals
   */
  async getAdminDeals(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = getAdminDealsQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { page, limit, is_published } = parsed.data;

    const result = await reviewService.getAdminDeals({
      page,
      limit,
      isPublished: is_published,
    });

    return reply.send(
      paginatedResponse(
        'Completed deals retrieved successfully',
        result.items.map(toCompletedDealListItemResponse),
        page,
        limit,
        result.totalItems
      )
    );
  },

  /**
   * Get completed deal by ID (admin)
   * GET /reviews/admin/deals/:id
   */
  async getDealById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = idParamSchema.safeParse(request.params);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const deal = await reviewService.getDealById(parsed.data.id);

    return reply.send(
      successResponse('Completed deal retrieved successfully', toCompletedDealResponse(deal))
    );
  },

  /**
   * Create a new completed deal (admin)
   * POST /reviews/admin/deals
   */
  async createDeal(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = createCompletedDealSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const {
      car_make,
      car_model,
      car_year,
      car_vin,
      auction_price,
      market_price,
      savings,
      delivery_city,
      description,
      is_published,
      photos,
    } = parsed.data;

    const deal = await reviewService.createDeal({
      carMake: car_make,
      carModel: car_model,
      carYear: car_year,
      carVin: car_vin,
      auctionPrice: auction_price,
      marketPrice: market_price,
      savings,
      deliveryCity: delivery_city,
      description,
      isPublished: is_published,
      photos: photos?.map((p) => ({
        url: p.url,
        altText: p.alt_text,
        photoType: p.photo_type,
        sortOrder: p.sort_order,
      })),
    });

    return reply.status(201).send(
      successResponse('Completed deal created successfully', toCompletedDealResponse(deal))
    );
  },

  /**
   * Update a completed deal (admin)
   * PATCH /reviews/admin/deals/:id
   */
  async updateDeal(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const paramsParsed = idParamSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      throw new ValidationError(
        'Validation failed',
        paramsParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const bodyParsed = updateCompletedDealSchema.safeParse(request.body);
    if (!bodyParsed.success) {
      throw new ValidationError(
        'Validation failed',
        bodyParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { id } = paramsParsed.data;
    const {
      car_make,
      car_model,
      car_year,
      car_vin,
      auction_price,
      market_price,
      savings,
      delivery_city,
      description,
      is_published,
      photos,
    } = bodyParsed.data;

    const deal = await reviewService.updateDeal(id, {
      carMake: car_make,
      carModel: car_model,
      carYear: car_year,
      carVin: car_vin,
      auctionPrice: auction_price,
      marketPrice: market_price,
      savings,
      deliveryCity: delivery_city,
      description,
      isPublished: is_published,
      photos: photos?.map((p) => ({
        url: p.url,
        altText: p.alt_text,
        photoType: p.photo_type,
        sortOrder: p.sort_order,
      })),
    });

    return reply.send(
      successResponse('Completed deal updated successfully', toCompletedDealResponse(deal))
    );
  },

  /**
   * Delete a completed deal (admin)
   * DELETE /reviews/admin/deals/:id
   */
  async deleteDeal(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = idParamSchema.safeParse(request.params);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    await reviewService.deleteDeal(parsed.data.id);

    return reply.send(
      successResponse('Completed deal deleted successfully', null)
    );
  },
};
