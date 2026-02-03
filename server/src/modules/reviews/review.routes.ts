import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { reviewController } from './review.controller';

export async function reviewRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // ===== PUBLIC ROUTES =====

  // Get published reviews (paginated)
  fastify.get('/', reviewController.getPublishedReviews);

  // Get aggregate rating data
  fastify.get('/aggregate', reviewController.getAggregateRating);

  // Get published completed deals (paginated)
  fastify.get('/deals', reviewController.getPublishedDeals);

  // ===== ADMIN ROUTES (MVP: No auth) =====

  // Get all reviews (including unpublished)
  fastify.get('/admin/reviews', reviewController.getAllReviews);

  // Get single review by ID
  fastify.get('/admin/reviews/:id', reviewController.getReviewById);

  // Create review
  fastify.post('/admin/reviews', reviewController.createReview);

  // Update review
  fastify.patch('/admin/reviews/:id', reviewController.updateReview);

  // Delete review
  fastify.delete('/admin/reviews/:id', reviewController.deleteReview);

  // Get all completed deals (including unpublished)
  fastify.get('/admin/deals', reviewController.getAllDeals);

  // Get single deal by ID
  fastify.get('/admin/deals/:id', reviewController.getDealById);

  // Create completed deal
  fastify.post('/admin/deals', reviewController.createDeal);

  // Update completed deal
  fastify.patch('/admin/deals/:id', reviewController.updateDeal);

  // Delete completed deal
  fastify.delete('/admin/deals/:id', reviewController.deleteDeal);
}
