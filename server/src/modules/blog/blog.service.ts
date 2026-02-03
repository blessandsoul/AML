import { NotFoundError, BadRequestError, ConflictError } from '../../shared/errors';
import { generateSlugWithTranslit } from '../../shared/helpers';
import { blogRepo } from './blog.repo';
import type {
  CreatePostDto,
  UpdatePostDto,
  PostFilters,
  CreateCategoryDto,
  CreateTagDto,
  ReactionType,
} from './blog.types';

export const blogService = {
  // ===== POSTS =====

  async findAllPublished(filters: PostFilters) {
    return blogRepo.findManyPublished(filters);
  },

  async findAll(filters: PostFilters) {
    return blogRepo.findMany(filters);
  },

  async findBySlug(slug: string) {
    const post = await blogRepo.findBySlug(slug);

    if (!post) {
      throw new NotFoundError('POST_NOT_FOUND', 'Blog post does not exist');
    }

    if (post.status !== 'PUBLISHED') {
      throw new NotFoundError('POST_NOT_PUBLISHED', 'Blog post is not published');
    }

    // Increment view count (fire and forget)
    blogRepo.incrementViewCount(post.id).catch(() => {});

    // Get reaction counts
    const reactionCounts = await blogRepo.getReactionCounts(post.id);

    return {
      ...post,
      reactionCounts,
    };
  },

  async findById(id: string) {
    const post = await blogRepo.findById(id);

    if (!post) {
      throw new NotFoundError('POST_NOT_FOUND', 'Blog post does not exist');
    }

    return post;
  },

  async create(dto: CreatePostDto) {
    const slug = await this.generateUniqueSlug(dto.title);

    if (dto.category_id) {
      const category = await blogRepo.findCategoryById(dto.category_id);
      if (!category) {
        throw new BadRequestError('CATEGORY_NOT_FOUND', 'Category does not exist');
      }
    }

    return blogRepo.create({ ...dto, slug });
  },

  async update(id: string, dto: UpdatePostDto) {
    const post = await blogRepo.findById(id);

    if (!post) {
      throw new NotFoundError('POST_NOT_FOUND', 'Blog post does not exist');
    }

    let slug = post.slug;
    if (dto.title && dto.title !== post.title) {
      slug = await this.generateUniqueSlug(dto.title, id);
    }

    if (dto.category_id) {
      const category = await blogRepo.findCategoryById(dto.category_id);
      if (!category) {
        throw new BadRequestError('CATEGORY_NOT_FOUND', 'Category does not exist');
      }
    }

    return blogRepo.update(id, { ...dto, slug });
  },

  async delete(id: string) {
    const post = await blogRepo.findById(id);

    if (!post) {
      throw new NotFoundError('POST_NOT_FOUND', 'Blog post does not exist');
    }

    await blogRepo.delete(id);
  },

  async publish(id: string) {
    const post = await blogRepo.findById(id);

    if (!post) {
      throw new NotFoundError('POST_NOT_FOUND', 'Blog post does not exist');
    }

    if (post.status === 'PUBLISHED') {
      throw new BadRequestError('ALREADY_PUBLISHED', 'Post is already published');
    }

    return blogRepo.updateStatus(id, 'PUBLISHED', new Date());
  },

  async unpublish(id: string) {
    const post = await blogRepo.findById(id);

    if (!post) {
      throw new NotFoundError('POST_NOT_FOUND', 'Blog post does not exist');
    }

    if (post.status !== 'PUBLISHED') {
      throw new BadRequestError('NOT_PUBLISHED', 'Post is not published');
    }

    return blogRepo.updateStatus(id, 'DRAFT');
  },

  async archive(id: string) {
    const post = await blogRepo.findById(id);

    if (!post) {
      throw new NotFoundError('POST_NOT_FOUND', 'Blog post does not exist');
    }

    return blogRepo.updateStatus(id, 'ARCHIVED');
  },

  // ===== REACTIONS =====

  async addReaction(postId: string, sessionId: string, type: ReactionType) {
    const post = await blogRepo.findById(postId);

    if (!post || post.status !== 'PUBLISHED') {
      throw new NotFoundError('POST_NOT_FOUND', 'Blog post does not exist or is not published');
    }

    const existing = await blogRepo.findReaction(postId, sessionId);

    if (existing) {
      if (existing.type === type) {
        // Same type - remove reaction (toggle)
        await blogRepo.deleteReaction(postId, sessionId);
        return { action: 'removed' };
      }
      // Different type - update
      await blogRepo.updateReaction(postId, sessionId, type);
      return { action: 'updated' };
    }

    await blogRepo.createReaction(postId, sessionId, type);
    return { action: 'added' };
  },

  async removeReaction(postId: string, sessionId: string) {
    const existing = await blogRepo.findReaction(postId, sessionId);

    if (!existing) {
      throw new NotFoundError('REACTION_NOT_FOUND', 'Reaction does not exist');
    }

    await blogRepo.deleteReaction(postId, sessionId);
  },

  // ===== CATEGORIES =====

  async findAllCategories() {
    return blogRepo.findAllCategories();
  },

  async createCategory(dto: CreateCategoryDto) {
    const slug = generateSlugWithTranslit(dto.name);

    const exists = await blogRepo.categorySlugExists(slug);
    if (exists) {
      throw new ConflictError('CATEGORY_EXISTS', 'Category with this name already exists');
    }

    return blogRepo.createCategory({ ...dto, slug });
  },

  async updateCategory(id: string, dto: Partial<CreateCategoryDto>) {
    const category = await blogRepo.findCategoryById(id);

    if (!category) {
      throw new NotFoundError('CATEGORY_NOT_FOUND', 'Category does not exist');
    }

    let slug = category.slug;
    if (dto.name && dto.name !== category.name) {
      slug = generateSlugWithTranslit(dto.name);
      const exists = await blogRepo.categorySlugExists(slug, id);
      if (exists) {
        throw new ConflictError('CATEGORY_EXISTS', 'Category with this name already exists');
      }
    }

    return blogRepo.updateCategory(id, { ...dto, slug });
  },

  async deleteCategory(id: string) {
    const category = await blogRepo.findCategoryById(id);

    if (!category) {
      throw new NotFoundError('CATEGORY_NOT_FOUND', 'Category does not exist');
    }

    await blogRepo.deleteCategory(id);
  },

  // ===== TAGS =====

  async findAllTags() {
    return blogRepo.findAllTags();
  },

  async createTag(dto: CreateTagDto) {
    const slug = generateSlugWithTranslit(dto.name);

    const exists = await blogRepo.tagSlugExists(slug);
    if (exists) {
      throw new ConflictError('TAG_EXISTS', 'Tag with this name already exists');
    }

    return blogRepo.createTag({ ...dto, slug });
  },

  async deleteTag(id: string) {
    await blogRepo.deleteTag(id);
  },

  // ===== HELPERS =====

  async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    let slug = generateSlugWithTranslit(title);
    let counter = 1;

    while (await blogRepo.slugExists(slug, excludeId)) {
      slug = `${generateSlugWithTranslit(title)}-${counter}`;
      counter++;
    }

    return slug;
  },
};
