import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500).optional(),
  featured_image: z.string().url().optional().or(z.literal('')),
  author_name: z.string().min(1, 'Author name is required').max(100),
  category_id: z.string().uuid().optional(),
  tag_ids: z.array(z.string().uuid()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

export const UpdatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(500).optional().nullable(),
  featured_image: z.string().url().optional().nullable().or(z.literal('')),
  category_id: z.string().uuid().optional().nullable(),
  tag_ids: z.array(z.string().uuid()).optional(),
});

export const PostFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  category_id: z.string().uuid().optional(),
  tag_slug: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
});

export const CreateTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
});

export const AddReactionSchema = z.object({
  type: z.enum(['LIKE', 'LOVE', 'HELPFUL']),
  session_id: z.string().min(1, 'Session ID is required').max(100),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
export type PostFiltersInput = z.infer<typeof PostFiltersSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type CreateTagInput = z.infer<typeof CreateTagSchema>;
export type AddReactionInput = z.infer<typeof AddReactionSchema>;
