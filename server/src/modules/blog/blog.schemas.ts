import { z } from 'zod';
import { paginationSchema } from '../../libs/pagination.js';

/**
 * Helper to generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Slug validation schema
 */
const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(200, 'Slug is too long')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

/**
 * Hex color validation schema
 */
const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g., #FF5733)')
  .optional()
  .nullable();

/**
 * Blog post status enum
 */
const postStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

/**
 * Blog reaction type enum
 */
const reactionTypeSchema = z.enum(['LIKE', 'LOVE', 'HELPFUL']);

// ============================================
// QUERY SCHEMAS
// ============================================

/**
 * Get posts query parameters (public)
 */
export const getPostsQuerySchema = paginationSchema.extend({
  category_id: z.string().uuid('Invalid category ID').optional(),
  tag_slug: z.string().max(100).optional(),
  search: z.string().max(200).trim().optional(),
});

export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;

/**
 * Get admin posts query parameters
 */
export const getAdminPostsQuerySchema = paginationSchema.extend({
  status: postStatusSchema.optional(),
  category_id: z.string().uuid('Invalid category ID').optional(),
  search: z.string().max(200).trim().optional(),
});

export type GetAdminPostsQuery = z.infer<typeof getAdminPostsQuerySchema>;

/**
 * Slug parameter schema
 */
export const slugParamSchema = z.object({
  slug: slugSchema,
});

export type SlugParam = z.infer<typeof slugParamSchema>;

/**
 * ID parameter schema
 */
export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export type IdParam = z.infer<typeof idParamSchema>;

/**
 * Post ID parameter schema
 */
export const postIdParamSchema = z.object({
  postId: z.string().uuid('Invalid post ID format'),
});

export type PostIdParam = z.infer<typeof postIdParamSchema>;

// ============================================
// POST SCHEMAS
// ============================================

/**
 * Create post body schema
 */
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .trim(),
  slug: slugSchema.optional(),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt is too long').trim().optional().nullable(),
  featured_image: z.string().url('Invalid image URL').optional().nullable(),
  images: z.array(z.string().url('Invalid image URL')).max(20).optional().nullable(),
  category_id: z.string().uuid('Invalid category ID').optional().nullable(),
  tag_ids: z.array(z.string().uuid('Invalid tag ID')).max(10).optional(),
  author_name: z
    .string()
    .min(1, 'Author name is required')
    .max(100, 'Author name is too long')
    .trim(),
  author_bio: z.string().max(500, 'Author bio is too long').trim().optional().nullable(),
  author_avatar: z.string().url('Invalid avatar URL').optional().nullable(),
  reading_time: z.coerce.number().int().positive().max(1000).optional().nullable(),
});

export type CreatePostBody = z.infer<typeof createPostSchema>;

/**
 * Update post body schema
 */
export const updatePostSchema = createPostSchema.partial();

export type UpdatePostBody = z.infer<typeof updatePostSchema>;

// ============================================
// CATEGORY SCHEMAS
// ============================================

/**
 * Create category body schema
 */
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .trim(),
  slug: slugSchema.optional(),
  description: z.string().max(500, 'Description is too long').trim().optional().nullable(),
  color: hexColorSchema,
});

export type CreateCategoryBody = z.infer<typeof createCategorySchema>;

/**
 * Update category body schema
 */
export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>;

// ============================================
// TAG SCHEMAS
// ============================================

/**
 * Create tag body schema
 */
export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name is too long')
    .trim(),
  slug: slugSchema.optional(),
});

export type CreateTagBody = z.infer<typeof createTagSchema>;

// ============================================
// REACTION SCHEMAS
// ============================================

/**
 * Add reaction body schema
 */
export const addReactionSchema = z.object({
  type: reactionTypeSchema,
  session_id: z.string().min(1, 'Session ID is required').max(100),
});

export type AddReactionBody = z.infer<typeof addReactionSchema>;

/**
 * Remove reaction query schema
 */
export const removeReactionQuerySchema = z.object({
  session_id: z.string().min(1, 'Session ID is required').max(100),
});

export type RemoveReactionQuery = z.infer<typeof removeReactionQuerySchema>;
