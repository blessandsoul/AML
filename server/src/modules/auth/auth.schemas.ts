import { z } from 'zod';
import { emailSchema, passwordSchema, loginPasswordSchema, nameSchema } from '../../libs/validation.js';

/**
 * Registration schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export type LoginDto = z.infer<typeof loginSchema>;

/**
 * Refresh token schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

/**
 * Logout schema
 */
export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type LogoutDto = z.infer<typeof logoutSchema>;
