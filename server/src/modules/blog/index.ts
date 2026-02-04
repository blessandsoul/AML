// Blog Module Exports

export { blogRoutes } from './blog.routes.js';
export { blogController } from './blog.controller.js';
export { blogService } from './blog.service.js';
export { blogRepo } from './blog.repo.js';

// Schema exports
export {
  generateSlug,
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
  type GetPostsQuery,
  type GetAdminPostsQuery,
  type SlugParam,
  type IdParam,
  type PostIdParam,
  type CreatePostBody,
  type UpdatePostBody,
  type CreateCategoryBody,
  type UpdateCategoryBody,
  type CreateTagBody,
  type AddReactionBody,
  type RemoveReactionQuery,
} from './blog.schemas.js';

// Type exports
export type {
  BlogCategoryEntity,
  BlogCategoryWithCount,
  BlogTagEntity,
  BlogTagWithCount,
  BlogPostEntity,
  BlogPostWithRelations,
  BlogPostListItem,
  BlogReactionEntity,
  ReactionCounts,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateTagInput,
  CreatePostInput,
  UpdatePostInput,
  PostQueryParams,
} from './blog.types.js';

export {
  toPostResponse,
  toPostListItemResponse,
  toCategoryResponse,
  toTagResponse,
} from './blog.types.js';
