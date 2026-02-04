// Review Module Exports

export { reviewRoutes } from './review.routes.js';
export { reviewController } from './review.controller.js';
export { reviewService } from './review.service.js';
export { reviewRepo } from './review.repo.js';

// Schema exports
export {
  getReviewsQuerySchema,
  getAdminReviewsQuerySchema,
  getDealsQuerySchema,
  getAdminDealsQuerySchema,
  idParamSchema,
  createReviewSchema,
  updateReviewSchema,
  createCompletedDealSchema,
  updateCompletedDealSchema,
  type GetReviewsQuery,
  type GetAdminReviewsQuery,
  type GetDealsQuery,
  type GetAdminDealsQuery,
  type IdParam,
  type CreateReviewBody,
  type UpdateReviewBody,
  type CreateCompletedDealBody,
  type UpdateCompletedDealBody,
} from './review.schemas.js';

// Type exports
export type {
  ReviewPhotoEntity,
  ReviewEntity,
  ReviewWithPhotos,
  ReviewListItem,
  CompletedDealPhotoEntity,
  CompletedDealEntity,
  CompletedDealWithPhotos,
  CompletedDealListItem,
  ReviewPhotoInput,
  CreateReviewInput,
  UpdateReviewInput,
  CompletedDealPhotoInput,
  CreateCompletedDealInput,
  UpdateCompletedDealInput,
  ReviewQueryParams,
  CompletedDealQueryParams,
  AggregateRating,
} from './review.types.js';

export {
  toReviewResponse,
  toReviewListItemResponse,
  toCompletedDealResponse,
  toCompletedDealListItemResponse,
  toAggregateRatingResponse,
} from './review.types.js';
