import { FastifyRequest, FastifyReply } from 'fastify';
import { reviewService } from './review.service';
import { successResponse, paginatedResponse } from '../../shared/helpers';
import {
  CreateReviewSchema,
  UpdateReviewSchema,
  ReviewFiltersSchema,
  CreateDealSchema,
  UpdateDealSchema,
  DealFiltersSchema,
} from './review.schemas';

type IdParams = { id: string };

export const reviewController = {
  // ===== PUBLIC ENDPOINTS =====

  async getPublishedReviews(request: FastifyRequest, reply: FastifyReply) {
    const filters = ReviewFiltersSchema.parse(request.query);
    const { items, totalItems } = await reviewService.findAllPublished(filters);

    return reply.send(
      paginatedResponse('Reviews retrieved successfully', items, filters.page, filters.limit, totalItems)
    );
  },

  async getAggregateRating(request: FastifyRequest, reply: FastifyReply) {
    const data = await reviewService.getAggregateRating();
    return reply.send(successResponse('Aggregate rating retrieved successfully', data));
  },

  async getPublishedDeals(request: FastifyRequest, reply: FastifyReply) {
    const filters = DealFiltersSchema.parse(request.query);
    const { items, totalItems } = await reviewService.findAllDealsPublished(filters);

    return reply.send(
      paginatedResponse('Completed deals retrieved successfully', items, filters.page, filters.limit, totalItems)
    );
  },

  // ===== ADMIN REVIEW ENDPOINTS =====

  async getAllReviews(request: FastifyRequest, reply: FastifyReply) {
    const filters = ReviewFiltersSchema.parse(request.query);
    const { items, totalItems } = await reviewService.findAll(filters);

    return reply.send(
      paginatedResponse('Reviews retrieved successfully', items, filters.page, filters.limit, totalItems)
    );
  },

  async getReviewById(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const review = await reviewService.findById(request.params.id);
    return reply.send(successResponse('Review retrieved successfully', review));
  },

  async createReview(request: FastifyRequest, reply: FastifyReply) {
    const dto = CreateReviewSchema.parse(request.body);
    const review = await reviewService.create(dto);

    return reply.status(201).send(successResponse('Review created successfully', review));
  },

  async updateReview(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const dto = UpdateReviewSchema.parse(request.body);
    const review = await reviewService.update(request.params.id, dto);

    return reply.send(successResponse('Review updated successfully', review));
  },

  async deleteReview(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    await reviewService.delete(request.params.id);
    return reply.send(successResponse('Review deleted successfully', null));
  },

  // ===== ADMIN DEAL ENDPOINTS =====

  async getAllDeals(request: FastifyRequest, reply: FastifyReply) {
    const filters = DealFiltersSchema.parse(request.query);
    const { items, totalItems } = await reviewService.findAllDeals(filters);

    return reply.send(
      paginatedResponse('Completed deals retrieved successfully', items, filters.page, filters.limit, totalItems)
    );
  },

  async getDealById(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const deal = await reviewService.findDealById(request.params.id);
    return reply.send(successResponse('Completed deal retrieved successfully', deal));
  },

  async createDeal(request: FastifyRequest, reply: FastifyReply) {
    const dto = CreateDealSchema.parse(request.body);
    const deal = await reviewService.createDeal(dto);

    return reply.status(201).send(successResponse('Completed deal created successfully', deal));
  },

  async updateDeal(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const dto = UpdateDealSchema.parse(request.body);
    const deal = await reviewService.updateDeal(request.params.id, dto);

    return reply.send(successResponse('Completed deal updated successfully', deal));
  },

  async deleteDeal(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    await reviewService.deleteDeal(request.params.id);
    return reply.send(successResponse('Completed deal deleted successfully', null));
  },
};
