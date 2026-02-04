import { blogRepo } from './blog.repo.js';
import { generateSlug } from './blog.schemas.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../libs/errors.js';
import type { BlogPostStatus, BlogReactionType } from '@prisma/client';
import type { PaginatedResult } from '../../libs/pagination.js';
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
  ReactionCounts,
} from './blog.types.js';

/**
 * Blog Service - Business logic for blog module
 */
export const blogService = {
  // ============================================
  // POSTS
  // ============================================

  /**
   * Get published posts for public (with optional filters)
   */
  async getPublishedPosts(params: {
    page: number;
    limit: number;
    categoryId?: string;
    tagSlug?: string;
    search?: string;
  }): Promise<PaginatedResult<BlogPostListItem>> {
    return blogRepo.findPosts({
      ...params,
      status: 'PUBLISHED',
    });
  },

  /**
   * Get all posts for admin (with optional filters)
   */
  async getAllPosts(params: {
    page: number;
    limit: number;
    status?: BlogPostStatus;
    categoryId?: string;
    search?: string;
  }): Promise<PaginatedResult<BlogPostListItem>> {
    return blogRepo.findPosts(params);
  },

  /**
   * Get post by slug (public - increments view count for published posts)
   */
  async getPostBySlug(slug: string): Promise<BlogPostWithRelations> {
    const post = await blogRepo.findPostBySlug(slug);

    if (!post) {
      throw new NotFoundError('Blog post', 'POST_NOT_FOUND');
    }

    // Only return published posts for public access
    if (post.status !== 'PUBLISHED') {
      throw new NotFoundError('Blog post', 'POST_NOT_FOUND');
    }

    // Increment view count (fire and forget)
    blogRepo.incrementViewCount(post.id).catch(() => {
      // Silently ignore view count errors
    });

    return post;
  },

  /**
   * Get post by ID (admin - returns any status)
   */
  async getPostById(id: string): Promise<BlogPostWithRelations> {
    const post = await blogRepo.findPostById(id);

    if (!post) {
      throw new NotFoundError('Blog post', 'POST_NOT_FOUND');
    }

    return post;
  },

  /**
   * Create a new post
   */
  async createPost(
    data: CreatePostInput,
    authorId?: string
  ): Promise<BlogPostWithRelations> {
    // Generate slug if not provided
    let slug = data.slug || generateSlug(data.title);

    // Ensure slug is unique
    let slugSuffix = 0;
    let originalSlug = slug;
    while (await blogRepo.isSlugTaken(slug)) {
      slugSuffix++;
      slug = `${originalSlug}-${slugSuffix}`;
    }

    // Validate category exists if provided
    if (data.categoryId) {
      const category = await blogRepo.findCategoryById(data.categoryId);
      if (!category) {
        throw new BadRequestError('Category not found', 'INVALID_CATEGORY');
      }
    }

    // Validate tags exist if provided
    if (data.tagIds?.length) {
      for (const tagId of data.tagIds) {
        const tag = await blogRepo.findTagById(tagId);
        if (!tag) {
          throw new BadRequestError(`Tag ${tagId} not found`, 'INVALID_TAG');
        }
      }
    }

    return blogRepo.createPost({
      ...data,
      slug,
      authorId,
    });
  },

  /**
   * Update a post
   */
  async updatePost(
    id: string,
    data: UpdatePostInput
  ): Promise<BlogPostWithRelations> {
    // Check if post exists
    const existingPost = await blogRepo.findPostById(id);
    if (!existingPost) {
      throw new NotFoundError('Blog post', 'POST_NOT_FOUND');
    }

    // Handle slug update
    let slug = data.slug;
    if (data.title && !data.slug) {
      // Generate new slug if title changed but no explicit slug provided
      slug = generateSlug(data.title);
    }

    // Ensure slug is unique if changed
    if (slug && slug !== existingPost.slug) {
      let slugSuffix = 0;
      let originalSlug = slug;
      while (await blogRepo.isSlugTaken(slug, id)) {
        slugSuffix++;
        slug = `${originalSlug}-${slugSuffix}`;
      }
    }

    // Validate category exists if provided
    if (data.categoryId) {
      const category = await blogRepo.findCategoryById(data.categoryId);
      if (!category) {
        throw new BadRequestError('Category not found', 'INVALID_CATEGORY');
      }
    }

    // Validate tags exist if provided
    if (data.tagIds?.length) {
      for (const tagId of data.tagIds) {
        const tag = await blogRepo.findTagById(tagId);
        if (!tag) {
          throw new BadRequestError(`Tag ${tagId} not found`, 'INVALID_TAG');
        }
      }
    }

    return blogRepo.updatePost(id, {
      ...data,
      ...(slug && { slug }),
    });
  },

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<void> {
    const post = await blogRepo.findPostById(id);
    if (!post) {
      throw new NotFoundError('Blog post', 'POST_NOT_FOUND');
    }

    await blogRepo.deletePost(id);
  },

  /**
   * Publish a post
   */
  async publishPost(id: string): Promise<BlogPostWithRelations> {
    const post = await blogRepo.findPostById(id);
    if (!post) {
      throw new NotFoundError('Blog post', 'POST_NOT_FOUND');
    }

    if (post.status === 'PUBLISHED') {
      throw new ConflictError('Post is already published', 'ALREADY_PUBLISHED');
    }

    return blogRepo.updatePostStatus(id, 'PUBLISHED');
  },

  /**
   * Unpublish a post (set to draft)
   */
  async unpublishPost(id: string): Promise<BlogPostWithRelations> {
    const post = await blogRepo.findPostById(id);
    if (!post) {
      throw new NotFoundError('Blog post', 'POST_NOT_FOUND');
    }

    if (post.status === 'DRAFT') {
      throw new ConflictError('Post is already a draft', 'ALREADY_DRAFT');
    }

    return blogRepo.updatePostStatus(id, 'DRAFT');
  },

  /**
   * Archive a post
   */
  async archivePost(id: string): Promise<BlogPostWithRelations> {
    const post = await blogRepo.findPostById(id);
    if (!post) {
      throw new NotFoundError('Blog post', 'POST_NOT_FOUND');
    }

    if (post.status === 'ARCHIVED') {
      throw new ConflictError('Post is already archived', 'ALREADY_ARCHIVED');
    }

    return blogRepo.updatePostStatus(id, 'ARCHIVED');
  },

  // ============================================
  // CATEGORIES
  // ============================================

  /**
   * Get all categories
   */
  async getCategories(): Promise<BlogCategoryWithCount[]> {
    return blogRepo.findAllCategories();
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<BlogCategoryEntity> {
    const category = await blogRepo.findCategoryById(id);
    if (!category) {
      throw new NotFoundError('Category', 'CATEGORY_NOT_FOUND');
    }
    return category;
  },

  /**
   * Create a category
   */
  async createCategory(data: CreateCategoryInput): Promise<BlogCategoryEntity> {
    // Generate slug if not provided
    const slug = data.slug || generateSlug(data.name);

    // Check if slug is taken
    if (await blogRepo.isCategorySlugTaken(slug)) {
      throw new ConflictError('Category slug already exists', 'SLUG_EXISTS');
    }

    return blogRepo.createCategory({
      ...data,
      slug,
    });
  },

  /**
   * Update a category
   */
  async updateCategory(
    id: string,
    data: UpdateCategoryInput
  ): Promise<BlogCategoryEntity> {
    const category = await blogRepo.findCategoryById(id);
    if (!category) {
      throw new NotFoundError('Category', 'CATEGORY_NOT_FOUND');
    }

    // Handle slug update
    let slug = data.slug;
    if (data.name && !data.slug) {
      slug = generateSlug(data.name);
    }

    // Check if slug is taken (excluding current category)
    if (slug && slug !== category.slug) {
      if (await blogRepo.isCategorySlugTaken(slug, id)) {
        throw new ConflictError('Category slug already exists', 'SLUG_EXISTS');
      }
    }

    return blogRepo.updateCategory(id, {
      ...data,
      ...(slug && { slug }),
    });
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    const category = await blogRepo.findCategoryById(id);
    if (!category) {
      throw new NotFoundError('Category', 'CATEGORY_NOT_FOUND');
    }

    await blogRepo.deleteCategory(id);
  },

  // ============================================
  // TAGS
  // ============================================

  /**
   * Get all tags
   */
  async getTags(): Promise<BlogTagWithCount[]> {
    return blogRepo.findAllTags();
  },

  /**
   * Create a tag
   */
  async createTag(data: CreateTagInput): Promise<BlogTagEntity> {
    // Generate slug if not provided
    const slug = data.slug || generateSlug(data.name);

    // Check if slug is taken
    if (await blogRepo.isTagSlugTaken(slug)) {
      throw new ConflictError('Tag slug already exists', 'SLUG_EXISTS');
    }

    return blogRepo.createTag({
      ...data,
      slug,
    });
  },

  /**
   * Delete a tag
   */
  async deleteTag(id: string): Promise<void> {
    const tag = await blogRepo.findTagById(id);
    if (!tag) {
      throw new NotFoundError('Tag', 'TAG_NOT_FOUND');
    }

    await blogRepo.deleteTag(id);
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
  ): Promise<{ action: string; counts: ReactionCounts }> {
    // Check if post exists and is published
    const post = await blogRepo.findPostById(postId);
    if (!post) {
      throw new NotFoundError('Blog post', 'POST_NOT_FOUND');
    }

    if (post.status !== 'PUBLISHED') {
      throw new BadRequestError(
        'Cannot react to unpublished post',
        'POST_NOT_PUBLISHED'
      );
    }

    const result = await blogRepo.addReaction(postId, sessionId, type);
    const counts = await blogRepo.getReactionCounts(postId);

    return {
      action: result.action,
      counts,
    };
  },

  /**
   * Remove a reaction
   */
  async removeReaction(
    postId: string,
    sessionId: string
  ): Promise<{ counts: ReactionCounts }> {
    // Check if post exists
    const post = await blogRepo.findPostById(postId);
    if (!post) {
      throw new NotFoundError('Blog post', 'POST_NOT_FOUND');
    }

    await blogRepo.removeReaction(postId, sessionId);
    const counts = await blogRepo.getReactionCounts(postId);

    return { counts };
  },

  /**
   * Get reaction counts for a post
   */
  async getReactionCounts(postId: string): Promise<ReactionCounts> {
    const post = await blogRepo.findPostById(postId);
    if (!post) {
      throw new NotFoundError('Blog post', 'POST_NOT_FOUND');
    }

    return blogRepo.getReactionCounts(postId);
  },
};
