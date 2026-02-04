import { prisma } from '../../libs/prisma.js';
import { calculateOffset } from '../../libs/pagination.js';
import type { BlogPostStatus, BlogReactionType, Prisma } from '@prisma/client';
import type {
  BlogCategoryEntity,
  BlogCategoryWithCount,
  BlogTagEntity,
  BlogTagWithCount,
  BlogPostWithRelations,
  BlogPostListItem,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateTagInput,
  CreatePostInput,
  UpdatePostInput,
  PostQueryParams,
  ReactionCounts,
} from './blog.types.js';

/**
 * Selection for blog post list items
 */
const postListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  featuredImage: true,
  status: true,
  authorName: true,
  authorAvatar: true,
  publishedAt: true,
  viewCount: true,
  readingTime: true,
  createdAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
  _count: {
    select: {
      reactions: true,
    },
  },
} as const;

/**
 * Selection for full blog post details
 */
const postDetailSelect = {
  id: true,
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  featuredImage: true,
  images: true,
  status: true,
  authorName: true,
  authorBio: true,
  authorAvatar: true,
  publishedAt: true,
  viewCount: true,
  readingTime: true,
  categoryId: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      color: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
        },
      },
    },
  },
  _count: {
    select: {
      reactions: true,
    },
  },
} as const;

/**
 * Blog Repository - Database operations for blog module
 */
export const blogRepo = {
  // ============================================
  // POSTS
  // ============================================

  /**
   * Find posts with pagination and filters
   */
  async findPosts(
    params: PostQueryParams
  ): Promise<{ items: BlogPostListItem[]; totalItems: number }> {
    const { page, limit, status, categoryId, tagSlug, search } = params;
    const offset = calculateOffset(page, limit);

    // Build where clause
    const where: Prisma.BlogPostWhereInput = {};

    // Status filter (default to PUBLISHED for public)
    if (status) {
      where.status = status;
    }

    // Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Tag filter
    if (tagSlug) {
      where.tags = {
        some: {
          tag: {
            slug: tagSlug,
          },
        },
      };
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    // Execute queries in parallel
    const [items, totalItems] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        select: postListSelect,
        orderBy: { publishedAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return { items: items as unknown as BlogPostListItem[], totalItems };
  },

  /**
   * Find post by slug
   */
  async findPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: postDetailSelect,
    });

    return post as unknown as BlogPostWithRelations | null;
  },

  /**
   * Find post by ID
   */
  async findPostById(id: string): Promise<BlogPostWithRelations | null> {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: postDetailSelect,
    });

    return post as unknown as BlogPostWithRelations | null;
  },

  /**
   * Create a new post
   */
  async createPost(data: CreatePostInput): Promise<BlogPostWithRelations> {
    const { tagIds, categoryId, images, authorId, ...restData } = data;

    const post = await prisma.blogPost.create({
      data: {
        title: restData.title,
        slug: restData.slug!,
        content: restData.content,
        excerpt: restData.excerpt,
        featuredImage: restData.featuredImage,
        images: images ?? undefined,
        status: restData.status,
        authorName: restData.authorName,
        authorBio: restData.authorBio,
        authorAvatar: restData.authorAvatar,
        readingTime: restData.readingTime,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        author: authorId ? { connect: { id: authorId } } : undefined,
        tags: tagIds?.length
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      select: postDetailSelect,
    });

    return post as unknown as BlogPostWithRelations;
  },

  /**
   * Update a post
   */
  async updatePost(
    id: string,
    data: UpdatePostInput
  ): Promise<BlogPostWithRelations> {
    const { tagIds, ...postData } = data;

    // If tagIds provided, update tags relation
    if (tagIds !== undefined) {
      // Delete existing tags
      await prisma.blogPostTag.deleteMany({
        where: { postId: id },
      });

      // Create new tag relations
      if (tagIds.length > 0) {
        await prisma.blogPostTag.createMany({
          data: tagIds.map((tagId) => ({
            postId: id,
            tagId,
          })),
        });
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...postData,
        images: postData.images ?? undefined,
      },
      select: postDetailSelect,
    });

    return post as unknown as BlogPostWithRelations;
  },

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<void> {
    await prisma.blogPost.delete({
      where: { id },
    });
  },

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<void> {
    await prisma.blogPost.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });
  },

  /**
   * Update post status
   */
  async updatePostStatus(
    id: string,
    status: BlogPostStatus
  ): Promise<BlogPostWithRelations> {
    const updateData: Parameters<typeof prisma.blogPost.update>[0]['data'] = {
      status,
    };

    // Set publishedAt when publishing
    if (status === 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      select: postDetailSelect,
    });

    return post as unknown as BlogPostWithRelations;
  },

  /**
   * Check if slug is taken
   */
  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { id: true },
    });

    return post !== null;
  },

  // ============================================
  // CATEGORIES
  // ============================================

  /**
   * Find all categories with post counts
   */
  async findAllCategories(): Promise<BlogCategoryWithCount[]> {
    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories;
  },

  /**
   * Find category by ID
   */
  async findCategoryById(id: string): Promise<BlogCategoryEntity | null> {
    return prisma.blogCategory.findUnique({
      where: { id },
    });
  },

  /**
   * Find category by slug
   */
  async findCategoryBySlug(slug: string): Promise<BlogCategoryEntity | null> {
    return prisma.blogCategory.findUnique({
      where: { slug },
    });
  },

  /**
   * Create a category
   */
  async createCategory(data: CreateCategoryInput): Promise<BlogCategoryEntity> {
    return prisma.blogCategory.create({
      data: {
        name: data.name,
        slug: data.slug!,
        description: data.description,
        color: data.color,
      },
    });
  },

  /**
   * Update a category
   */
  async updateCategory(
    id: string,
    data: UpdateCategoryInput
  ): Promise<BlogCategoryEntity> {
    return prisma.blogCategory.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    await prisma.blogCategory.delete({
      where: { id },
    });
  },

  /**
   * Check if category slug is taken
   */
  async isCategorySlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const category = await prisma.blogCategory.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { id: true },
    });

    return category !== null;
  },

  // ============================================
  // TAGS
  // ============================================

  /**
   * Find all tags with post counts
   */
  async findAllTags(): Promise<BlogTagWithCount[]> {
    const tags = await prisma.blogTag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return tags;
  },

  /**
   * Find tag by ID
   */
  async findTagById(id: string): Promise<BlogTagEntity | null> {
    return prisma.blogTag.findUnique({
      where: { id },
    });
  },

  /**
   * Find tag by slug
   */
  async findTagBySlug(slug: string): Promise<BlogTagEntity | null> {
    return prisma.blogTag.findUnique({
      where: { slug },
    });
  },

  /**
   * Create a tag
   */
  async createTag(data: CreateTagInput): Promise<BlogTagEntity> {
    return prisma.blogTag.create({
      data: {
        name: data.name,
        slug: data.slug!,
      },
    });
  },

  /**
   * Delete a tag
   */
  async deleteTag(id: string): Promise<void> {
    await prisma.blogTag.delete({
      where: { id },
    });
  },

  /**
   * Check if tag slug is taken
   */
  async isTagSlugTaken(slug: string): Promise<boolean> {
    const tag = await prisma.blogTag.findUnique({
      where: { slug },
      select: { id: true },
    });

    return tag !== null;
  },

  // ============================================
  // REACTIONS
  // ============================================

  /**
   * Add or update a reaction
   */
  async addReaction(
    postId: string,
    sessionId: string,
    type: BlogReactionType
  ): Promise<{ action: 'created' | 'updated' }> {
    // Check if user already has a reaction of this type
    const existing = await prisma.blogReaction.findFirst({
      where: { postId, sessionId },
    });

    if (existing) {
      // Update existing reaction
      await prisma.blogReaction.update({
        where: { id: existing.id },
        data: { type },
      });
      return { action: 'updated' };
    }

    // Create new reaction
    await prisma.blogReaction.create({
      data: {
        postId,
        sessionId,
        type,
      },
    });

    return { action: 'created' };
  },

  /**
   * Remove a reaction
   */
  async removeReaction(postId: string, sessionId: string): Promise<boolean> {
    const result = await prisma.blogReaction.deleteMany({
      where: { postId, sessionId },
    });

    return result.count > 0;
  },

  /**
   * Get reaction counts for a post
   */
  async getReactionCounts(postId: string): Promise<ReactionCounts> {
    const counts = await prisma.blogReaction.groupBy({
      by: ['type'],
      where: { postId },
      _count: true,
    });

    const result: ReactionCounts = {
      LIKE: 0,
      LOVE: 0,
      HELPFUL: 0,
      total: 0,
    };

    counts.forEach((item) => {
      result[item.type] = item._count;
      result.total += item._count;
    });

    return result;
  },

  /**
   * Get user's reaction on a post
   */
  async getUserReaction(
    postId: string,
    sessionId: string
  ): Promise<BlogReactionType | null> {
    const reaction = await prisma.blogReaction.findFirst({
      where: { postId, sessionId },
      select: { type: true },
    });

    return reaction?.type ?? null;
  },
};
