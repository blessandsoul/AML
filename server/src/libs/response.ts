import type { PaginationMeta } from './pagination.js';

/**
 * Standard success response structure
 */
export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

/**
 * Standard paginated response structure
 */
export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(message: string, data: T): SuccessResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Create a standardized paginated response
 */
export function paginatedResponse<T>(
  message: string,
  items: T[],
  page: number,
  limit: number,
  totalItems: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    success: true,
    message,
    data: {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  };
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  code: string,
  message: string,
  details?: Record<string, string[]>
): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
}
