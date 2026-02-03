import { AppError } from './app-error';

export class BadRequestError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 400);
  }
}

export class ValidationError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 409);
  }
}

export class InternalError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 500, false);
  }
}
