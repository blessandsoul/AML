import type { FastifyInstance } from 'fastify';
import { reviewController } from './review.controller.js';
import { requireRoles } from '../../middlewares/authGuard.js';

// Inline body schemas for validation
const CreateReviewBodySchema = {
  type: 'object',
  required: ['customer_name', 'rating', 'text'],
  properties: {
    customer_name: { type: 'string', maxLength: 200 },
    customer_city: { type: 'string', maxLength: 100 },
    customer_avatar: { type: 'string', format: 'uri' },
    rating: { type: 'integer', minimum: 1, maximum: 5 },
    text: { type: 'string', maxLength: 5000 },
    car_make: { type: 'string', maxLength: 100 },
    car_model: { type: 'string', maxLength: 100 },
    car_year: { type: 'integer', minimum: 1900, maximum: 2100 },
    is_verified: { type: 'boolean', default: false },
    is_published: { type: 'boolean', default: true },
    photos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', format: 'uri' },
          alt_text: { type: 'string' },
          sort_order: { type: 'integer' },
        },
      },
    },
  },
} as const;

const CreateCompletedDealBodySchema = {
  type: 'object',
  required: ['car_make', 'car_model', 'car_year', 'auction_price', 'market_price', 'savings'],
  properties: {
    car_make: { type: 'string', maxLength: 100 },
    car_model: { type: 'string', maxLength: 100 },
    car_year: { type: 'integer', minimum: 1900, maximum: 2100 },
    car_vin: { type: 'string', maxLength: 50 },
    auction_price: { type: 'number' },
    market_price: { type: 'number' },
    savings: { type: 'number' },
    delivery_city: { type: 'string', maxLength: 100 },
    description: { type: 'string', maxLength: 5000 },
    is_published: { type: 'boolean', default: true },
    photos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', format: 'uri' },
          alt_text: { type: 'string' },
          photo_type: { type: 'string', enum: ['BEFORE', 'AFTER'] },
          sort_order: { type: 'integer' },
        },
      },
    },
  },
} as const;

/**
 * Review Routes
 * Prefix: /api/v1/reviews
 */
export async function reviewRoutes(app: FastifyInstance): Promise<void> {
  // ============================================
  // PUBLIC ENDPOINTS - REVIEWS
  // ============================================

  /**
   * GET /api/v1/reviews
   * Get published reviews list (public)
   */
  app.get('/reviews', {
    schema: {
      tags: ['Reviews - Public'],
      summary: 'Get published reviews',
      description: 'Get a paginated list of published reviews',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          is_verified: { type: 'string', enum: ['true', 'false'] },
        },
      },
    },
  }, reviewController.getReviews);

  /**
   * GET /api/v1/reviews/aggregate
   * Get aggregate rating statistics (public)
   */
  app.get('/reviews/aggregate', {
    schema: {
      tags: ['Reviews - Public'],
      summary: 'Get aggregate rating',
      description: 'Get average rating, total reviews, and rating distribution',
    },
  }, reviewController.getAggregateRating);

  // ============================================
  // PUBLIC ENDPOINTS - COMPLETED DEALS
  // ============================================

  /**
   * GET /api/v1/reviews/deals
   * Get published completed deals list (public)
   */
  app.get('/reviews/deals', {
    schema: {
      tags: ['Reviews - Public'],
      summary: 'Get completed deals',
      description: 'Get a paginated list of published completed deals',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        },
      },
    },
  }, reviewController.getDeals);

  // ============================================
  // ADMIN ENDPOINTS - REVIEWS (Protected - ADMIN role)
  // ============================================

  /**
   * GET /api/v1/reviews/admin/reviews
   * List all reviews including unpublished (admin)
   */
  app.get('/reviews/admin/reviews', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Reviews - Admin'],
      summary: 'List all reviews (admin)',
      description: 'Get all reviews including unpublished. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          is_verified: { type: 'string', enum: ['true', 'false'] },
          is_published: { type: 'string', enum: ['true', 'false'] },
        },
      },
    },
  }, reviewController.getAdminReviews);

  /**
   * GET /api/v1/reviews/admin/reviews/:id
   * Get review by ID (admin)
   */
  app.get('/reviews/admin/reviews/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Reviews - Admin'],
      summary: 'Get review by ID',
      description: 'Get full review details with photos. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, reviewController.getReviewById);

  /**
   * POST /api/v1/reviews/admin/reviews
   * Create a new review (admin)
   */
  app.post('/reviews/admin/reviews', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Reviews - Admin'],
      summary: 'Create review',
      description: 'Create a new review. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      body: CreateReviewBodySchema,
    },
  }, reviewController.createReview);

  /**
   * PATCH /api/v1/reviews/admin/reviews/:id
   * Update review details (admin)
   */
  app.patch('/reviews/admin/reviews/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Reviews - Admin'],
      summary: 'Update review',
      description: 'Update review details. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: CreateReviewBodySchema,
    },
  }, reviewController.updateReview);

  /**
   * DELETE /api/v1/reviews/admin/reviews/:id
   * Delete a review (admin)
   */
  app.delete('/reviews/admin/reviews/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Reviews - Admin'],
      summary: 'Delete review',
      description: 'Delete a review. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, reviewController.deleteReview);

  // ============================================
  // ADMIN ENDPOINTS - COMPLETED DEALS (Protected - ADMIN role)
  // ============================================

  /**
   * GET /api/v1/reviews/admin/deals
   * List all completed deals including unpublished (admin)
   */
  app.get('/reviews/admin/deals', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Reviews - Admin'],
      summary: 'List all deals (admin)',
      description: 'Get all completed deals including unpublished. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          is_published: { type: 'string', enum: ['true', 'false'] },
        },
      },
    },
  }, reviewController.getAdminDeals);

  /**
   * GET /api/v1/reviews/admin/deals/:id
   * Get completed deal by ID (admin)
   */
  app.get('/reviews/admin/deals/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Reviews - Admin'],
      summary: 'Get deal by ID',
      description: 'Get full deal details with photos. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, reviewController.getDealById);

  /**
   * POST /api/v1/reviews/admin/deals
   * Create a new completed deal (admin)
   */
  app.post('/reviews/admin/deals', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Reviews - Admin'],
      summary: 'Create completed deal',
      description: 'Create a new completed deal. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      body: CreateCompletedDealBodySchema,
    },
  }, reviewController.createDeal);

  /**
   * PATCH /api/v1/reviews/admin/deals/:id
   * Update completed deal details (admin)
   */
  app.patch('/reviews/admin/deals/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Reviews - Admin'],
      summary: 'Update completed deal',
      description: 'Update completed deal details. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: CreateCompletedDealBodySchema,
    },
  }, reviewController.updateDeal);

  /**
   * DELETE /api/v1/reviews/admin/deals/:id
   * Delete a completed deal (admin)
   */
  app.delete('/reviews/admin/deals/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Reviews - Admin'],
      summary: 'Delete completed deal',
      description: 'Delete a completed deal. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, reviewController.deleteDeal);
}
