export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

export function successResponse<T>(message: string, data: T): SuccessResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(code: string, message: string): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}

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
