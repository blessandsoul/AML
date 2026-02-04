export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ReactionType = 'LIKE' | 'LOVE' | 'HELPFUL';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count?: {
    posts: number;
  };
}

export interface BlogPostTag {
  postId: string;
  tagId: string;
  tag: BlogTag;
}

export interface BlogReaction {
  id: string;
  type: ReactionType;
  sessionId: string;
  postId: string;
  createdAt: string;
}

export interface BlogAuthor {
  name: string;
  avatar: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt: string | null;
  featuredImage: string | null;
  images?: string[];
  status: PostStatus;
  author: BlogAuthor;
  publishedAt: string | null;
  viewCount: number;
  readingTime?: number;
  categoryId: string | null;
  category: BlogCategory | null;
  tags: BlogTag[];
  reactions?: BlogReaction[];
  reactionCount?: number;
  reactionCounts?: Record<ReactionType, number>;
  _count?: {
    reactions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorName: string;
  categoryId?: string;
  tagIds?: string[];
  status?: PostStatus;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
}

export interface PostFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  tagSlug?: string;
  search?: string;
  status?: PostStatus;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface CreateTagRequest {
  name: string;
}

export interface AddReactionRequest {
  type: ReactionType;
  sessionId: string;
}
