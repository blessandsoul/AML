/**
 * Auth Module - User authentication and authorization
 */

// Routes
export { authRoutes } from './auth.routes.js';

// Service
export { authService } from './auth.service.js';

// Repository
export { authRepo } from './auth.repo.js';

// Types
export type {
  UserEntity,
  UserWithPassword,
  RegisterInput,
  LoginInput,
  TokenPair,
  AuthResult,
  RefreshTokenEntity,
  CreateUserInput,
  UserResponse,
} from './auth.types.js';
export { toUserResponse } from './auth.types.js';

// Schemas
export {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from './auth.schemas.js';
export type {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  LogoutDto,
} from './auth.schemas.js';
