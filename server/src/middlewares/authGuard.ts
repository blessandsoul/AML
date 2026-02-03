import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../libs/errors.js';
import type { UserRoleType } from '../libs/authorization.js';

/**
 * JWT payload structure
 */
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRoleType;
  emailVerified: boolean;
  iat?: number;
  exp?: number;
}

/**
 * Extend FastifyRequest to include user
 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

/**
 * Extract token from Authorization header
 */
function extractToken(request: FastifyRequest): string | null {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

/**
 * Verify and decode JWT token
 */
function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expired', 'TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token', 'INVALID_TOKEN');
    }
    throw new UnauthorizedError('Authentication failed', 'AUTH_FAILED');
  }
}

/**
 * Auth guard middleware - requires authentication
 * Extracts and validates JWT token, attaches user to request
 */
export async function authGuard(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  const token = extractToken(request);

  if (!token) {
    throw new UnauthorizedError('No authentication token provided', 'NO_TOKEN');
  }

  const payload = verifyToken(token);
  request.user = payload;
}

/**
 * Optional auth guard - doesn't require authentication but attaches user if present
 */
export async function optionalAuthGuard(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  const token = extractToken(request);

  if (token) {
    try {
      const payload = verifyToken(token);
      request.user = payload;
    } catch {
      // Silently ignore invalid tokens for optional auth
      request.user = undefined;
    }
  }
}

/**
 * Role guard factory - creates middleware that requires specific roles
 */
export function requireRoles(...roles: UserRoleType[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await authGuard(request, reply);

    if (!request.user || !roles.includes(request.user.role)) {
      throw new UnauthorizedError(
        `This action requires one of the following roles: ${roles.join(', ')}`,
        'INSUFFICIENT_ROLE'
      );
    }
  };
}

/**
 * Generate access token
 */
export function generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): { userId: string } {
  try {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as { userId: string };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token expired', 'REFRESH_TOKEN_EXPIRED');
    }
    throw new UnauthorizedError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
  }
}
