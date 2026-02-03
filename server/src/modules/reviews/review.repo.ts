import { prisma } from '../../libs/prisma';
import type { ReviewFilters, CreateReviewDto, UpdateReviewDto, CreateDealDto, UpdateDealDto, DealFilters } from './review.types';

export const reviewRepo = {
  // ===== REVIEWS =====

  async findManyPublished(filters: ReviewFilters) {
    const { page = 1, limit = 10, rating, is_verified } = filters;
    const skip = (page - 1) * limit;

    const where: any = { is_published: true };
    if (rating) where.rating = rating;
    if (is_verified !== undefined) where.is_verified = is_verified;

    const [items, totalItems] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { photos: { orderBy: { sort_order: 'asc' } } },
      }),
      prisma.review.count({ where }),
    ]);

    return { items, totalItems };
  },

  async findMany(filters: ReviewFilters) {
    const { page = 1, limit = 10, rating } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (rating) where.rating = rating;

    const [items, totalItems] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { photos: { orderBy: { sort_order: 'asc' } } },
      }),
      prisma.review.count({ where }),
    ]);

    return { items, totalItems };
  },

  async findById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: { photos: { orderBy: { sort_order: 'asc' } } },
    });
  },

  async create(data: CreateReviewDto) {
    const { photos, ...reviewData } = data;

    return prisma.review.create({
      data: {
        ...reviewData,
        photos: photos?.length
          ? { create: photos }
          : undefined,
      },
      include: { photos: { orderBy: { sort_order: 'asc' } } },
    });
  },

  async update(id: string, data: UpdateReviewDto) {
    const { photos, ...reviewData } = data;

    if (photos !== undefined) {
      await prisma.reviewPhoto.deleteMany({ where: { review_id: id } });
    }

    return prisma.review.update({
      where: { id },
      data: {
        ...reviewData,
        photos: photos?.length
          ? { create: photos }
          : undefined,
      },
      include: { photos: { orderBy: { sort_order: 'asc' } } },
    });
  },

  async delete(id: string) {
    return prisma.review.delete({ where: { id } });
  },

  async getAggregateRating() {
    const result = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: true,
      where: { is_published: true },
    });

    return {
      averageRating: Math.round((result._avg.rating || 0) * 10) / 10,
      totalReviews: result._count,
    };
  },

  // ===== COMPLETED DEALS =====

  async findManyDealsPublished(filters: DealFilters) {
    const { page = 1, limit = 12 } = filters;
    const skip = (page - 1) * limit;

    const where = { is_published: true };

    const [items, totalItems] = await Promise.all([
      prisma.completedDeal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { photos: { orderBy: { sort_order: 'asc' } } },
      }),
      prisma.completedDeal.count({ where }),
    ]);

    return { items, totalItems };
  },

  async findManyDeals(filters: DealFilters) {
    const { page = 1, limit = 12 } = filters;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      prisma.completedDeal.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { photos: { orderBy: { sort_order: 'asc' } } },
      }),
      prisma.completedDeal.count(),
    ]);

    return { items, totalItems };
  },

  async findDealById(id: string) {
    return prisma.completedDeal.findUnique({
      where: { id },
      include: { photos: { orderBy: { sort_order: 'asc' } } },
    });
  },

  async createDeal(data: CreateDealDto) {
    const { photos, ...dealData } = data;

    return prisma.completedDeal.create({
      data: {
        ...dealData,
        photos: photos?.length
          ? { create: photos }
          : undefined,
      },
      include: { photos: { orderBy: { sort_order: 'asc' } } },
    });
  },

  async updateDeal(id: string, data: UpdateDealDto) {
    const { photos, ...dealData } = data;

    if (photos !== undefined) {
      await prisma.completedDealPhoto.deleteMany({ where: { deal_id: id } });
    }

    return prisma.completedDeal.update({
      where: { id },
      data: {
        ...dealData,
        photos: photos?.length
          ? { create: photos }
          : undefined,
      },
      include: { photos: { orderBy: { sort_order: 'asc' } } },
    });
  },

  async deleteDeal(id: string) {
    return prisma.completedDeal.delete({ where: { id } });
  },
};
