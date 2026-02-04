import argon2 from 'argon2';
import { authRepo } from './auth.repo.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../middlewares/authGuard.js';
import { env } from '../../config/env.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} from '../../libs/errors.js';
import type {
  RegisterInput,
  LoginInput,
  AuthResult,
  TokenPair,
  UserEntity,
} from './auth.types.js';

/**
 * Parse duration string (e.g., '7d', '15m', '1h') to milliseconds
 */
function parseDurationToMs(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
}

/**
 * Calculate refresh token expiration date
 */
function getRefreshTokenExpiresAt(): Date {
  const durationMs = parseDurationToMs(env.REFRESH_TOKEN_EXPIRES_IN);
  return new Date(Date.now() + durationMs);
}

/**
 * Auth Service - Business logic for authentication
 */
export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<AuthResult> {
    // Check if email is already taken
    const emailTaken = await authRepo.isEmailTaken(data.email);
    if (emailTaken) {
      throw new ConflictError('Email is already registered', 'EMAIL_EXISTS');
    }

    // Hash password
    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });

    // Create user
    const user = await authRepo.createUser({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return { user, tokens };
  },

  /**
   * Login user with email and password
   */
  async login(data: LoginInput): Promise<AuthResult> {
    // Find user by email (with password for verification)
    const user = await authRepo.findUserByEmailWithPassword(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ForbiddenError('Account is deactivated', 'ACCOUNT_DEACTIVATED');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, data.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Update last login timestamp
    await authRepo.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    // Verify refresh token JWT
    const payload = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await authRepo.findRefreshToken(refreshToken);
    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }

    // Check if refresh token is expired
    if (storedToken.expiresAt < new Date()) {
      await authRepo.deleteRefreshToken(refreshToken);
      throw new UnauthorizedError('Refresh token expired', 'REFRESH_TOKEN_EXPIRED');
    }

    // Get user
    const user = await authRepo.findUserById(payload.userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ForbiddenError('Account is deactivated', 'ACCOUNT_DEACTIVATED');
    }

    // Delete old refresh token
    await authRepo.deleteRefreshToken(refreshToken);

    // Generate new tokens
    return this.generateTokens(user);
  },

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(refreshToken: string): Promise<void> {
    // Delete refresh token from database
    await authRepo.deleteRefreshToken(refreshToken);
  },

  /**
   * Logout from all devices
   */
  async logoutAll(userId: string): Promise<void> {
    await authRepo.deleteAllUserRefreshTokens(userId);
  },

  /**
   * Get current user by ID
   */
  async getCurrentUser(userId: string): Promise<UserEntity> {
    const user = await authRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  },

  /**
   * Generate access and refresh tokens for user
   */
  async generateTokens(user: UserEntity): Promise<TokenPair> {
    // Generate access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Generate refresh token
    const refreshTokenJwt = generateRefreshToken(user.id);

    // Store refresh token in database
    const expiresAt = getRefreshTokenExpiresAt();
    await authRepo.saveRefreshToken(user.id, refreshTokenJwt, expiresAt);

    return {
      accessToken,
      refreshToken: refreshTokenJwt,
    };
  },

  /**
   * Cleanup expired refresh tokens (for scheduled job)
   */
  async cleanupExpiredTokens(): Promise<number> {
    return authRepo.deleteExpiredRefreshTokens();
  },
};
