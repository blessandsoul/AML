import { NotFoundError } from '../../shared/errors';
import { reviewRepo } from './review.repo';
import type {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewFilters,
  CreateDealDto,
  UpdateDealDto,
  DealFilters,
} from './review.types';

export const reviewService = {
  // ===== REVIEWS =====

  async findAllPublished(filters: ReviewFilters) {
    return reviewRepo.findManyPublished(filters);
  },

  async findAll(filters: ReviewFilters) {
    return reviewRepo.findMany(filters);
  },

  async findById(id: string) {
    const review = await reviewRepo.findById(id);

    if (!review) {
      throw new NotFoundError('REVIEW_NOT_FOUND', 'Review does not exist');
    }

    return review;
  },

  async create(dto: CreateReviewDto) {
    return reviewRepo.create(dto);
  },

  async update(id: string, dto: UpdateReviewDto) {
    const review = await reviewRepo.findById(id);

    if (!review) {
      throw new NotFoundError('REVIEW_NOT_FOUND', 'Review does not exist');
    }

    return reviewRepo.update(id, dto);
  },

  async delete(id: string) {
    const review = await reviewRepo.findById(id);

    if (!review) {
      throw new NotFoundError('REVIEW_NOT_FOUND', 'Review does not exist');
    }

    await reviewRepo.delete(id);
  },

  async getAggregateRating() {
    return reviewRepo.getAggregateRating();
  },

  // ===== COMPLETED DEALS =====

  async findAllDealsPublished(filters: DealFilters) {
    return reviewRepo.findManyDealsPublished(filters);
  },

  async findAllDeals(filters: DealFilters) {
    return reviewRepo.findManyDeals(filters);
  },

  async findDealById(id: string) {
    const deal = await reviewRepo.findDealById(id);

    if (!deal) {
      throw new NotFoundError('DEAL_NOT_FOUND', 'Completed deal does not exist');
    }

    return deal;
  },

  async createDeal(dto: CreateDealDto) {
    return reviewRepo.createDeal(dto);
  },

  async updateDeal(id: string, dto: UpdateDealDto) {
    const deal = await reviewRepo.findDealById(id);

    if (!deal) {
      throw new NotFoundError('DEAL_NOT_FOUND', 'Completed deal does not exist');
    }

    return reviewRepo.updateDeal(id, dto);
  },

  async deleteDeal(id: string) {
    const deal = await reviewRepo.findDealById(id);

    if (!deal) {
      throw new NotFoundError('DEAL_NOT_FOUND', 'Completed deal does not exist');
    }

    await reviewRepo.deleteDeal(id);
  },
};
