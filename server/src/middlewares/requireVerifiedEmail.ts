import type { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenError } from '../libs/errors.js';

/**
 * Middleware to require verified email
 * Must be used AFTER authGuard middleware
 */
export async function requireVerifiedEmail(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  // Ensure user is authenticated first
  if (!request.user) {
    throw new ForbiddenError(
      'Authentication required',
      'AUTH_REQUIRED'
    );
  }

  // Check email verification status
  if (!request.user.emailVerified) {
    throw new ForbiddenError(
      'Please verify your email address to access this resource',
      'EMAIL_NOT_VERIFIED'
    );
  }
}

/**
 * Combined middleware: auth + email verification
 * Convenience function to apply both checks
 */
export function requireAuthAndVerifiedEmail() {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // Import authGuard dynamically to avoid circular dependencies
    const { authGuard } = await import('./authGuard.js');

    await authGuard(request, reply);
    await requireVerifiedEmail(request, reply);
  };
}
