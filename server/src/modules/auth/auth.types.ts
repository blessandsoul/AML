import type { UserRole } from '@prisma/client';

/**
 * User entity returned from database (excluding password)
 */
export interface UserEntity {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User with password (for internal use only)
 */
export interface UserWithPassword extends UserEntity {
  password: string;
}

/**
 * Registration input data
 */
export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Login input data
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Token pair returned after login/register
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Auth result returned after login/register
 */
export interface AuthResult {
  user: UserEntity;
  tokens: TokenPair;
}

/**
 * Refresh token entity from database
 */
export interface RefreshTokenEntity {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Create user input for repository
 */
export interface CreateUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

/**
 * User response DTO (for API responses)
 */
export interface UserResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transform user entity to response DTO
 */
export function toUserResponse(user: UserEntity): UserResponse {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
