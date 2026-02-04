import { prisma } from '../../libs/prisma.js';
import type { CreateUserInput, UserEntity, UserWithPassword, RefreshTokenEntity } from './auth.types.js';

/**
 * User selection without password
 */
const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Auth Repository - Database operations for authentication
 */
export const authRepo = {
  /**
   * Find user by email (without password)
   */
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });
  },

  /**
   * Find user by email with password (for login verification)
   */
  async findUserByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Find user by ID (without password)
   */
  async findUserById(id: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  },

  /**
   * Create a new user
   */
  async createUser(data: CreateUserInput): Promise<UserEntity> {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role ?? 'USER',
      },
      select: userSelect,
    });
  },

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  },

  /**
   * Save refresh token to database
   */
  async saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<RefreshTokenEntity> {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  },

  /**
   * Find refresh token by token string
   */
  async findRefreshToken(token: string): Promise<RefreshTokenEntity | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  },

  /**
   * Delete refresh token (for logout)
   */
  async deleteRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  },

  /**
   * Delete all refresh tokens for a user (logout from all devices)
   */
  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  },

  /**
   * Delete expired refresh tokens (cleanup job)
   */
  async deleteExpiredRefreshTokens(): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  },

  /**
   * Check if email is already taken
   */
  async isEmailTaken(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return user !== null;
  },
};
