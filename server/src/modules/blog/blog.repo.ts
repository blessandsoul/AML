import { prisma } from '../../libs/prisma';
import type { PostStatus, ReactionType } from '@prisma/client';
import type { PostFilters, CreatePostDto, UpdatePostDto, CreateCategoryDto, CreateTagDto } from './blog.types';

export const blogRepo = {
  // ===== POSTS =====

  async findManyPublished(filters: PostFilters) {
    const { page = 1, limit = 10, category_id, tag_slug, search } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED',
      published_at: { lte: new Date() },
    };

    if (category_id) {
      where.category_id = category_id;
    }

    if (tag_slug) {
      where.tags = {
        some: {
          tag: { slug: tag_slug },
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { published_at: 'desc' },
        include: {
          category: true,
          tags: {
            include: { tag: true },
          },
          _count: {
            select: { reactions: true },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return { items, totalItems };
  },

  async findMany(filters: PostFilters) {
    const { page = 1, limit = 10, status } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [items, totalItems] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          category: true,
          tags: { include: { tag: true } },
          _count: { select: { reactions: true } },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return { items, totalItems };
  },

  async findBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: { include: { tag: true } },
        reactions: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });
  },

  async create(data: CreatePostDto & { slug: string }) {
    const { tag_ids, ...postData } = data;

    return prisma.blogPost.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: postData.excerpt,
        featured_image: postData.featured_image,
        status: postData.status || 'DRAFT',
        author_name: postData.author_name,
        category_id: postData.category_id,
        tags: tag_ids?.length
          ? {
              create: tag_ids.map((tag_id) => ({ tag_id })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });
  },

  async update(id: string, data: UpdatePostDto & { slug?: string }) {
    const { tag_ids, ...postData } = data;

    // If tag_ids provided, delete existing and create new
    if (tag_ids !== undefined) {
      await prisma.blogPostTag.deleteMany({ where: { post_id: id } });
    }

    return prisma.blogPost.update({
      where: { id },
      data: {
        ...postData,
        tags: tag_ids?.length
          ? {
              create: tag_ids.map((tag_id) => ({ tag_id })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });
  },

  async delete(id: string) {
    return prisma.blogPost.delete({ where: { id } });
  },

  async updateStatus(id: string, status: PostStatus, published_at?: Date) {
    return prisma.blogPost.update({
      where: { id },
      data: {
        status,
        published_at,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });
  },

  async incrementViewCount(id: string) {
    return prisma.blogPost.update({
      where: { id },
      data: { view_count: { increment: 1 } },
    });
  },

  async slugExists(slug: string, excludeId?: string) {
    const where: any = { slug };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const count = await prisma.blogPost.count({ where });
    return count > 0;
  },

  // ===== REACTIONS =====

  async findReaction(post_id: string, session_id: string) {
    return prisma.blogReaction.findUnique({
      where: {
        post_id_session_id: { post_id, session_id },
      },
    });
  },

  async createReaction(post_id: string, session_id: string, type: ReactionType) {
    return prisma.blogReaction.create({
      data: { post_id, session_id, type },
    });
  },

  async updateReaction(post_id: string, session_id: string, type: ReactionType) {
    return prisma.blogReaction.update({
      where: {
        post_id_session_id: { post_id, session_id },
      },
      data: { type },
    });
  },

  async deleteReaction(post_id: string, session_id: string) {
    return prisma.blogReaction.delete({
      where: {
        post_id_session_id: { post_id, session_id },
      },
    });
  },

  async getReactionCounts(post_id: string) {
    const reactions = await prisma.blogReaction.groupBy({
      by: ['type'],
      where: { post_id },
      _count: true,
    });

    return reactions.reduce(
      (acc, r) => {
        acc[r.type] = r._count;
        return acc;
      },
      { LIKE: 0, LOVE: 0, HELPFUL: 0 } as Record<ReactionType, number>
    );
  },

  // ===== CATEGORIES =====

  async findAllCategories() {
    return prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { posts: true } },
      },
    });
  },

  async findCategoryById(id: string) {
    return prisma.blogCategory.findUnique({ where: { id } });
  },

  async categorySlugExists(slug: string, excludeId?: string) {
    const where: any = { slug };
    if (excludeId) where.id = { not: excludeId };
    const count = await prisma.blogCategory.count({ where });
    return count > 0;
  },

  async createCategory(data: CreateCategoryDto & { slug: string }) {
    return prisma.blogCategory.create({
      data,
      include: { _count: { select: { posts: true } } },
    });
  },

  async updateCategory(id: string, data: Partial<CreateCategoryDto> & { slug?: string }) {
    return prisma.blogCategory.update({
      where: { id },
      data,
      include: { _count: { select: { posts: true } } },
    });
  },

  async deleteCategory(id: string) {
    return prisma.blogCategory.delete({ where: { id } });
  },

  // ===== TAGS =====

  async findAllTags() {
    return prisma.blogTag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { posts: true } },
      },
    });
  },

  async tagSlugExists(slug: string) {
    const count = await prisma.blogTag.count({ where: { slug } });
    return count > 0;
  },

  async createTag(data: CreateTagDto & { slug: string }) {
    return prisma.blogTag.create({
      data,
      include: { _count: { select: { posts: true } } },
    });
  },

  async deleteTag(id: string) {
    return prisma.blogTag.delete({ where: { id } });
  },
};
