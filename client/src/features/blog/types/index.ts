export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ReactionType = 'LIKE' | 'LOVE' | 'HELPFUL';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
  _count?: {
    posts: number;
  };
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  _count?: {
    posts: number;
  };
}

export interface BlogPostTag {
  post_id: string;
  tag_id: string;
  tag: BlogTag;
}

export interface BlogReaction {
  id: string;
  type: ReactionType;
  session_id: string;
  post_id: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  images?: string[]; // Multiple images for gallery
  status: PostStatus;
  author_name: string;
  author_bio?: string; // Author description
  author_avatar?: string; // Author image
  published_at: string | null;
  view_count: number;
  reading_time?: number; // Calculated reading time in minutes
  category_id: string | null;
  category: BlogCategory | null;
  tags: BlogPostTag[];
  reactions?: BlogReaction[];
  reactionCounts?: Record<ReactionType, number>;
  _count?: {
    reactions: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_name: string;
  category_id?: string;
  tag_ids?: string[];
  status?: PostStatus;
}

export interface UpdatePostRequest {
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
  session_id: string;
}
