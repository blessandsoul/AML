import type { FastifyInstance } from 'fastify';
import { blogController } from './blog.controller.js';
import { requireRoles } from '../../middlewares/authGuard.js';

// Inline body schemas for validation
const AddReactionBodySchema = {
  type: 'object',
  required: ['type', 'session_id'],
  properties: {
    type: { type: 'string', enum: ['LIKE', 'LOVE', 'HELPFUL'] },
    session_id: { type: 'string' },
  },
} as const;

const CreatePostBodySchema = {
  type: 'object',
  required: ['title', 'content', 'author_name'],
  properties: {
    title: { type: 'string', maxLength: 200 },
    slug: { type: 'string', maxLength: 200 },
    content: { type: 'string' },
    excerpt: { type: 'string', maxLength: 500 },
    featured_image: { type: 'string', format: 'uri' },
    images: { type: 'array', items: { type: 'string', format: 'uri' } },
    category_id: { type: 'string', format: 'uuid' },
    tag_ids: { type: 'array', items: { type: 'string', format: 'uuid' } },
    author_name: { type: 'string', maxLength: 100 },
    author_bio: { type: 'string', maxLength: 500 },
    author_avatar: { type: 'string', format: 'uri' },
    reading_time: { type: 'integer' },
  },
} as const;

const CreateCategoryBodySchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', maxLength: 100 },
    slug: { type: 'string', maxLength: 200 },
    description: { type: 'string', maxLength: 500 },
    color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
  },
} as const;

const CreateTagBodySchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', maxLength: 50 },
    slug: { type: 'string', maxLength: 200 },
  },
} as const;

/**
 * Blog Routes
 * Prefix: /api/v1/blog
 */
export async function blogRoutes(app: FastifyInstance): Promise<void> {
  // ============================================
  // PUBLIC ENDPOINTS
  // ============================================

  /**
   * GET /api/v1/blog
   * Get paginated published posts
   */
  app.get('/blog', {
    schema: {
      tags: ['Blog - Public'],
      summary: 'Get published posts',
      description: 'Get a paginated list of published blog posts',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          category_id: { type: 'string', format: 'uuid' },
          tag_slug: { type: 'string' },
          search: { type: 'string', maxLength: 200 },
        },
      },
    },
  }, blogController.getPosts);

  /**
   * GET /api/v1/blog/slug/:slug
   * Get post by slug (increments view count)
   */
  app.get('/blog/slug/:slug', {
    schema: {
      tags: ['Blog - Public'],
      summary: 'Get post by slug',
      description: 'Get a single blog post by its slug. Increments the view count.',
      params: {
        type: 'object',
        required: ['slug'],
        properties: {
          slug: { type: 'string', minLength: 1, maxLength: 200 },
        },
      },
    },
  }, blogController.getPostBySlug);

  /**
   * GET /api/v1/blog/categories
   * Get all categories with post counts
   */
  app.get('/blog/categories', {
    schema: {
      tags: ['Blog - Public'],
      summary: 'Get all categories',
      description: 'Get all blog categories with their post counts',
    },
  }, blogController.getCategories);

  /**
   * GET /api/v1/blog/tags
   * Get all tags with post counts
   */
  app.get('/blog/tags', {
    schema: {
      tags: ['Blog - Public'],
      summary: 'Get all tags',
      description: 'Get all blog tags with their post counts',
    },
  }, blogController.getTags);

  /**
   * POST /api/v1/blog/:postId/reactions
   * Add reaction to a post
   */
  app.post('/blog/:postId/reactions', {
    schema: {
      tags: ['Blog - Public'],
      summary: 'Add reaction to post',
      description: 'Add a reaction (LIKE, LOVE, or HELPFUL) to a blog post',
      params: {
        type: 'object',
        required: ['postId'],
        properties: {
          postId: { type: 'string', format: 'uuid' },
        },
      },
      body: AddReactionBodySchema,
    },
  }, blogController.addReaction);

  /**
   * DELETE /api/v1/blog/:postId/reactions
   * Remove reaction from a post
   */
  app.delete('/blog/:postId/reactions', {
    schema: {
      tags: ['Blog - Public'],
      summary: 'Remove reaction from post',
      description: 'Remove a reaction from a blog post',
      params: {
        type: 'object',
        required: ['postId'],
        properties: {
          postId: { type: 'string', format: 'uuid' },
        },
      },
      querystring: {
        type: 'object',
        required: ['session_id'],
        properties: {
          session_id: { type: 'string', minLength: 1 },
        },
      },
    },
  }, blogController.removeReaction);

  // ============================================
  // ADMIN ENDPOINTS (Protected - ADMIN role)
  // ============================================

  /**
   * GET /api/v1/blog/admin/posts
   * List all posts (any status)
   */
  app.get('/blog/admin/posts', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'List all posts (admin)',
      description: 'Get all posts including drafts and archived. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
          category_id: { type: 'string', format: 'uuid' },
          search: { type: 'string', maxLength: 200 },
        },
      },
    },
  }, blogController.getAdminPosts);

  /**
   * GET /api/v1/blog/admin/posts/:id
   * Get post by ID (any status)
   */
  app.get('/blog/admin/posts/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Get post by ID (admin)',
      description: 'Get a single post by ID, regardless of status. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, blogController.getAdminPostById);

  /**
   * POST /api/v1/blog/admin/posts
   * Create a new post
   */
  app.post('/blog/admin/posts', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Create post',
      description: 'Create a new blog post. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      body: CreatePostBodySchema,
    },
  }, blogController.createPost);

  /**
   * PATCH /api/v1/blog/admin/posts/:id
   * Update a post
   */
  app.patch('/blog/admin/posts/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Update post',
      description: 'Update an existing blog post. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: CreatePostBodySchema,
    },
  }, blogController.updatePost);

  /**
   * DELETE /api/v1/blog/admin/posts/:id
   * Delete a post
   */
  app.delete('/blog/admin/posts/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Delete post',
      description: 'Delete a blog post. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, blogController.deletePost);

  /**
   * POST /api/v1/blog/admin/posts/:id/publish
   * Publish a post
   */
  app.post('/blog/admin/posts/:id/publish', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Publish post',
      description: 'Publish a draft post. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, blogController.publishPost);

  /**
   * POST /api/v1/blog/admin/posts/:id/unpublish
   * Unpublish a post
   */
  app.post('/blog/admin/posts/:id/unpublish', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Unpublish post',
      description: 'Unpublish a post (set to draft). Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, blogController.unpublishPost);

  /**
   * POST /api/v1/blog/admin/posts/:id/archive
   * Archive a post
   */
  app.post('/blog/admin/posts/:id/archive', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Archive post',
      description: 'Archive a post. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, blogController.archivePost);

  // --- Categories ---

  /**
   * POST /api/v1/blog/admin/categories
   * Create a category
   */
  app.post('/blog/admin/categories', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Create category',
      description: 'Create a new blog category. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      body: CreateCategoryBodySchema,
    },
  }, blogController.createCategory);

  /**
   * PATCH /api/v1/blog/admin/categories/:id
   * Update a category
   */
  app.patch('/blog/admin/categories/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Update category',
      description: 'Update a blog category. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: CreateCategoryBodySchema,
    },
  }, blogController.updateCategory);

  /**
   * DELETE /api/v1/blog/admin/categories/:id
   * Delete a category
   */
  app.delete('/blog/admin/categories/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Delete category',
      description: 'Delete a blog category. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, blogController.deleteCategory);

  // --- Tags ---

  /**
   * POST /api/v1/blog/admin/tags
   * Create a tag
   */
  app.post('/blog/admin/tags', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Create tag',
      description: 'Create a new blog tag. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      body: CreateTagBodySchema,
    },
  }, blogController.createTag);

  /**
   * DELETE /api/v1/blog/admin/tags/:id
   * Delete a tag
   */
  app.delete('/blog/admin/tags/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Blog - Admin'],
      summary: 'Delete tag',
      description: 'Delete a blog tag. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, blogController.deleteTag);
}
