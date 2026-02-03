import type { PostStatus, ReactionType } from '@prisma/client';

export type { PostStatus, ReactionType };

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: PostStatus;
  author_name: string;
  published_at: Date | null;
  view_count: number;
  category_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
}

export interface BlogReaction {
  id: string;
  type: ReactionType;
  session_id: string;
  post_id: string;
  created_at: Date;
}

export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_name: string;
  category_id?: string;
  tag_ids?: string[];
  status?: PostStatus;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  excerpt?: string | null;
  featured_image?: string | null;
  category_id?: string | null;
  tag_ids?: string[];
}

export interface PostFilters {
  page?: number;
  limit?: number;
  category_id?: string;
  tag_slug?: string;
  search?: string;
  status?: PostStatus;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  color?: string;
}

export interface CreateTagDto {
  name: string;
}

export interface AddReactionDto {
  type: ReactionType;
  session_id: string;
}
