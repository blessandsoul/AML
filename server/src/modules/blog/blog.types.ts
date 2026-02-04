import type { BlogPostStatus, BlogReactionType } from '@prisma/client';

/**
 * Blog Category entity
 */
export interface BlogCategoryEntity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Blog Category with post count
 */
export interface BlogCategoryWithCount extends BlogCategoryEntity {
  _count: {
    posts: number;
  };
}

/**
 * Blog Tag entity
 */
export interface BlogTagEntity {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

/**
 * Blog Tag with post count
 */
export interface BlogTagWithCount extends BlogTagEntity {
  _count: {
    posts: number;
  };
}

/**
 * Blog Post entity (basic)
 */
export interface BlogPostEntity {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  images: string[] | null;
  status: BlogPostStatus;
  authorName: string;
  authorBio: string | null;
  authorAvatar: string | null;
  publishedAt: Date | null;
  viewCount: number;
  readingTime: number | null;
  categoryId: string | null;
  authorId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Blog Post with relations
 */
export interface BlogPostWithRelations extends BlogPostEntity {
  category: BlogCategoryEntity | null;
  tags: {
    tag: BlogTagEntity;
  }[];
  _count: {
    reactions: number;
  };
}

/**
 * Blog Post list item (optimized for list views)
 */
export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  status: BlogPostStatus;
  authorName: string;
  authorAvatar: string | null;
  publishedAt: Date | null;
  viewCount: number;
  readingTime: number | null;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  } | null;
  tags: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  _count: {
    reactions: number;
  };
}

/**
 * Blog Reaction entity
 */
export interface BlogReactionEntity {
  id: string;
  type: BlogReactionType;
  sessionId: string;
  postId: string;
  createdAt: Date;
}

/**
 * Reaction counts by type
 */
export interface ReactionCounts {
  LIKE: number;
  LOVE: number;
  HELPFUL: number;
  total: number;
}

/**
 * Input types for creating/updating
 */
export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string | null;
  color?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string | null;
  color?: string | null;
}

export interface CreateTagInput {
  name: string;
  slug?: string;
}

export interface CreatePostInput {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  images?: string[] | null;
  status?: BlogPostStatus;
  authorName: string;
  authorBio?: string | null;
  authorAvatar?: string | null;
  readingTime?: number | null;
  categoryId?: string | null;
  authorId?: string | null;
  tagIds?: string[];
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  images?: string[] | null;
  status?: BlogPostStatus;
  authorName?: string;
  authorBio?: string | null;
  authorAvatar?: string | null;
  readingTime?: number | null;
  categoryId?: string | null;
  tagIds?: string[];
}

/**
 * Query parameters for finding posts
 */
export interface PostQueryParams {
  page: number;
  limit: number;
  status?: BlogPostStatus;
  categoryId?: string;
  tagSlug?: string;
  search?: string;
}

/**
 * API Response transformers
 */
export function toPostResponse(post: BlogPostWithRelations) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    images: post.images,
    status: post.status,
    author: {
      name: post.authorName,
      bio: post.authorBio,
      avatar: post.authorAvatar,
    },
    publishedAt: post.publishedAt,
    viewCount: post.viewCount,
    readingTime: post.readingTime,
    category: post.category
      ? {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug,
          color: post.category.color,
        }
      : null,
    tags: post.tags.map((pt) => ({
      id: pt.tag.id,
      name: pt.tag.name,
      slug: pt.tag.slug,
    })),
    reactionCount: post._count.reactions,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export function toPostListItemResponse(post: BlogPostListItem) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    status: post.status,
    author: {
      name: post.authorName,
      avatar: post.authorAvatar,
    },
    publishedAt: post.publishedAt,
    viewCount: post.viewCount,
    readingTime: post.readingTime,
    category: post.category
      ? {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug,
          color: post.category.color,
        }
      : null,
    tags: post.tags.map((pt) => ({
      id: pt.tag.id,
      name: pt.tag.name,
      slug: pt.tag.slug,
    })),
    reactionCount: post._count.reactions,
    createdAt: post.createdAt,
  };
}

export function toCategoryResponse(category: BlogCategoryWithCount | BlogCategoryEntity) {
  const base = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    color: category.color,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };

  if ('_count' in category) {
    return {
      ...base,
      postCount: category._count.posts,
    };
  }

  return base;
}

export function toTagResponse(tag: BlogTagWithCount | BlogTagEntity) {
  const base = {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    createdAt: tag.createdAt,
  };

  if ('_count' in tag) {
    return {
      ...base,
      postCount: tag._count.posts,
    };
  }

  return base;
}
