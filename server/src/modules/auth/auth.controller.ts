import type { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from './auth.service.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from './auth.schemas.js';
import { successResponse } from '../../libs/response.js';
import { ValidationError } from '../../libs/errors.js';
import { toUserResponse } from './auth.types.js';

/**
 * Auth Controller - HTTP request handlers
 */
export const authController = {
  /**
   * Register a new user
   * POST /auth/register
   */
  async register(
    request: FastifyRequest<{ Body: unknown }>,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const result = await authService.register(parsed.data);

    return reply.status(201).send(
      successResponse('User registered successfully', {
        user: toUserResponse(result.user),
        tokens: result.tokens,
      })
    );
  },

  /**
   * Login user
   * POST /auth/login
   */
  async login(
    request: FastifyRequest<{ Body: unknown }>,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const result = await authService.login(parsed.data);

    return reply.send(
      successResponse('Login successful', {
        user: toUserResponse(result.user),
        tokens: result.tokens,
      })
    );
  },

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  async refresh(
    request: FastifyRequest<{ Body: unknown }>,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = refreshTokenSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const tokens = await authService.refreshToken(parsed.data.refreshToken);

    return reply.send(
      successResponse('Token refreshed successfully', { tokens })
    );
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  async logout(
    request: FastifyRequest<{ Body: unknown }>,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = logoutSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    await authService.logout(parsed.data.refreshToken);

    return reply.send(
      successResponse('Logged out successfully', null)
    );
  },

  /**
   * Get current authenticated user
   * GET /auth/me
   */
  async me(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = request.user!.userId;
    const user = await authService.getCurrentUser(userId);

    return reply.send(
      successResponse('User retrieved successfully', {
        user: toUserResponse(user),
      })
    );
  },
};
