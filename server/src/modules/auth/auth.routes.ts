import type { FastifyInstance } from 'fastify';
import { authController } from './auth.controller.js';
import { authGuard } from '../../middlewares/authGuard.js';

// Inline schemas for validation (avoids $ref resolution issues)
const RegisterRequestSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  },
} as const;

const LoginRequestSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
} as const;

const RefreshRequestSchema = {
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: { type: 'string' },
  },
} as const;

/**
 * Auth Routes
 * Prefix: /api/v1/auth
 */
export async function authRoutes(app: FastifyInstance): Promise<void> {
  /**
   * POST /api/v1/auth/register
   * Register a new user account
   */
  app.post('/auth/register', {
    schema: {
      tags: ['Auth'],
      summary: 'Register a new user',
      description: 'Create a new user account with email and password',
      body: RegisterRequestSchema,
    },
  }, authController.register);

  /**
   * POST /api/v1/auth/login
   * Login with email and password
   */
  app.post('/auth/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Login user',
      description: 'Authenticate user with email and password',
      body: LoginRequestSchema,
    },
  }, authController.login);

  /**
   * POST /api/v1/auth/refresh
   * Refresh access token using refresh token
   */
  app.post('/auth/refresh', {
    schema: {
      tags: ['Auth'],
      summary: 'Refresh access token',
      description: 'Get a new access token using a valid refresh token',
      body: RefreshRequestSchema,
    },
  }, authController.refresh);

  /**
   * POST /api/v1/auth/logout
   * Logout and invalidate refresh token
   */
  app.post('/auth/logout', {
    schema: {
      tags: ['Auth'],
      summary: 'Logout user',
      description: 'Invalidate the refresh token and logout the user',
      body: RefreshRequestSchema,
    },
  }, authController.logout);

  /**
   * GET /api/v1/auth/me
   * Get current authenticated user
   * Requires: Authentication
   */
  app.get('/auth/me', {
    preHandler: [authGuard],
    schema: {
      tags: ['Auth'],
      summary: 'Get current user',
      description: 'Get the profile of the currently authenticated user',
      security: [{ bearerAuth: [] }],
    },
  }, authController.me);
}
