import type { FastifyRequest, FastifyReply } from 'fastify';
import { blogService } from './blog.service.js';
import {
  getPostsQuerySchema,
  getAdminPostsQuerySchema,
  slugParamSchema,
  idParamSchema,
  postIdParamSchema,
  createPostSchema,
  updatePostSchema,
  createCategorySchema,
  updateCategorySchema,
  createTagSchema,
  addReactionSchema,
  removeReactionQuerySchema,
} from './blog.schemas.js';
import { successResponse, paginatedResponse } from '../../libs/response.js';
import { ValidationError } from '../../libs/errors.js';
import {
  toPostResponse,
  toPostListItemResponse,
  toCategoryResponse,
  toTagResponse,
} from './blog.types.js';

/**
 * Blog Controller - HTTP request handlers
 */
export const blogController = {
  // ============================================
  // PUBLIC - POSTS
  // ============================================

  /**
   * Get published posts (public)
   * GET /blog
   */
  async getPosts(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = getPostsQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { page, limit, category_id, tag_slug, search } = parsed.data;

    const result = await blogService.getPublishedPosts({
      page,
      limit,
      categoryId: category_id,
      tagSlug: tag_slug,
      search,
    });

    return reply.send(
      paginatedResponse(
        'Posts retrieved successfully',
        result.items.map(toPostListItemResponse),
        page,
        limit,
        result.totalItems
      )
    );
  },

  /**
   * Get post by slug (public)
   * GET /blog/slug/:slug
   */
  async getPostBySlug(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = slugParamSchema.safeParse(request.params);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const post = await blogService.getPostBySlug(parsed.data.slug);

    return reply.send(
      successResponse('Post retrieved successfully', toPostResponse(post))
    );
  },

  /**
   * Get categories (public)
   * GET /blog/categories
   */
  async getCategories(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const categories = await blogService.getCategories();

    return reply.send(
      successResponse(
        'Categories retrieved successfully',
        categories.map(toCategoryResponse)
      )
    );
  },

  /**
   * Get tags (public)
   * GET /blog/tags
   */
  async getTags(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const tags = await blogService.getTags();

    return reply.send(
      successResponse(
        'Tags retrieved successfully',
        tags.map(toTagResponse)
      )
    );
  },

  /**
   * Add reaction to post (public)
   * POST /blog/:postId/reactions
   */
  async addReaction(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const paramsParsed = postIdParamSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      throw new ValidationError(
        'Validation failed',
        paramsParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const bodyParsed = addReactionSchema.safeParse(request.body);
    if (!bodyParsed.success) {
      throw new ValidationError(
        'Validation failed',
        bodyParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { postId } = paramsParsed.data;
    const { type, session_id } = bodyParsed.data;

    const result = await blogService.addReaction(postId, session_id, type);

    return reply.send(
      successResponse('Reaction added successfully', result)
    );
  },

  /**
   * Remove reaction from post (public)
   * DELETE /blog/:postId/reactions
   */
  async removeReaction(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const paramsParsed = postIdParamSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      throw new ValidationError(
        'Validation failed',
        paramsParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const queryParsed = removeReactionQuerySchema.safeParse(request.query);
    if (!queryParsed.success) {
      throw new ValidationError(
        'Validation failed',
        queryParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { postId } = paramsParsed.data;
    const { session_id } = queryParsed.data;

    const result = await blogService.removeReaction(postId, session_id);

    return reply.send(
      successResponse('Reaction removed successfully', result)
    );
  },

  // ============================================
  // ADMIN - POSTS
  // ============================================

  /**
   * Get all posts (admin)
   * GET /blog/admin/posts
   */
  async getAdminPosts(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = getAdminPostsQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { page, limit, status, category_id, search } = parsed.data;

    const result = await blogService.getAllPosts({
      page,
      limit,
      status,
      categoryId: category_id,
      search,
    });

    return reply.send(
      paginatedResponse(
        'Posts retrieved successfully',
        result.items.map(toPostListItemResponse),
        page,
        limit,
        result.totalItems
      )
    );
  },

  /**
   * Get post by ID (admin)
   * GET /blog/admin/posts/:id
   */
  async getAdminPostById(
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

    const post = await blogService.getPostById(parsed.data.id);

    return reply.send(
      successResponse('Post retrieved successfully', toPostResponse(post))
    );
  },

  /**
   * Create a post (admin)
   * POST /blog/admin/posts
   */
  async createPost(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = createPostSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const {
      title,
      slug,
      content,
      excerpt,
      featured_image,
      images,
      category_id,
      tag_ids,
      author_name,
      author_bio,
      author_avatar,
      reading_time,
    } = parsed.data;

    const authorId = request.user?.userId;

    const post = await blogService.createPost(
      {
        title,
        slug,
        content,
        excerpt,
        featuredImage: featured_image,
        images,
        categoryId: category_id,
        tagIds: tag_ids,
        authorName: author_name,
        authorBio: author_bio,
        authorAvatar: author_avatar,
        readingTime: reading_time,
      },
      authorId
    );

    return reply.status(201).send(
      successResponse('Post created successfully', toPostResponse(post))
    );
  },

  /**
   * Update a post (admin)
   * PATCH /blog/admin/posts/:id
   */
  async updatePost(
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

    const bodyParsed = updatePostSchema.safeParse(request.body);
    if (!bodyParsed.success) {
      throw new ValidationError(
        'Validation failed',
        bodyParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { id } = paramsParsed.data;
    const {
      title,
      slug,
      content,
      excerpt,
      featured_image,
      images,
      category_id,
      tag_ids,
      author_name,
      author_bio,
      author_avatar,
      reading_time,
    } = bodyParsed.data;

    const post = await blogService.updatePost(id, {
      title,
      slug,
      content,
      excerpt,
      featuredImage: featured_image,
      images,
      categoryId: category_id,
      tagIds: tag_ids,
      authorName: author_name,
      authorBio: author_bio,
      authorAvatar: author_avatar,
      readingTime: reading_time,
    });

    return reply.send(
      successResponse('Post updated successfully', toPostResponse(post))
    );
  },

  /**
   * Delete a post (admin)
   * DELETE /blog/admin/posts/:id
   */
  async deletePost(
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

    await blogService.deletePost(parsed.data.id);

    return reply.send(
      successResponse('Post deleted successfully', null)
    );
  },

  /**
   * Publish a post (admin)
   * POST /blog/admin/posts/:id/publish
   */
  async publishPost(
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

    const post = await blogService.publishPost(parsed.data.id);

    return reply.send(
      successResponse('Post published successfully', toPostResponse(post))
    );
  },

  /**
   * Unpublish a post (admin)
   * POST /blog/admin/posts/:id/unpublish
   */
  async unpublishPost(
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

    const post = await blogService.unpublishPost(parsed.data.id);

    return reply.send(
      successResponse('Post unpublished successfully', toPostResponse(post))
    );
  },

  /**
   * Archive a post (admin)
   * POST /blog/admin/posts/:id/archive
   */
  async archivePost(
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

    const post = await blogService.archivePost(parsed.data.id);

    return reply.send(
      successResponse('Post archived successfully', toPostResponse(post))
    );
  },

  // ============================================
  // ADMIN - CATEGORIES
  // ============================================

  /**
   * Create a category (admin)
   * POST /blog/admin/categories
   */
  async createCategory(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = createCategorySchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { name, slug, description, color } = parsed.data;

    const category = await blogService.createCategory({
      name,
      slug,
      description,
      color,
    });

    return reply.status(201).send(
      successResponse('Category created successfully', toCategoryResponse(category))
    );
  },

  /**
   * Update a category (admin)
   * PATCH /blog/admin/categories/:id
   */
  async updateCategory(
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

    const bodyParsed = updateCategorySchema.safeParse(request.body);
    if (!bodyParsed.success) {
      throw new ValidationError(
        'Validation failed',
        bodyParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { id } = paramsParsed.data;
    const { name, slug, description, color } = bodyParsed.data;

    const category = await blogService.updateCategory(id, {
      name,
      slug,
      description,
      color,
    });

    return reply.send(
      successResponse('Category updated successfully', toCategoryResponse(category))
    );
  },

  /**
   * Delete a category (admin)
   * DELETE /blog/admin/categories/:id
   */
  async deleteCategory(
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

    await blogService.deleteCategory(parsed.data.id);

    return reply.send(
      successResponse('Category deleted successfully', null)
    );
  },

  // ============================================
  // ADMIN - TAGS
  // ============================================

  /**
   * Create a tag (admin)
   * POST /blog/admin/tags
   */
  async createTag(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = createTagSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { name, slug } = parsed.data;

    const tag = await blogService.createTag({ name, slug });

    return reply.status(201).send(
      successResponse('Tag created successfully', toTagResponse(tag))
    );
  },

  /**
   * Delete a tag (admin)
   * DELETE /blog/admin/tags/:id
   */
  async deleteTag(
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

    await blogService.deleteTag(parsed.data.id);

    return reply.send(
      successResponse('Tag deleted successfully', null)
    );
  },
};
