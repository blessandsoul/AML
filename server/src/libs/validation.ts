import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255, 'Email is too long')
  .transform((email) => email.toLowerCase().trim());

/**
 * Password validation schema
 * Requirements: 8+ chars, uppercase, lowercase, number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Simple password schema (for login - less strict)
 */
export const loginPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(100, 'Password is too long');

/**
 * UUID validation schema
 */
export const uuidSchema = z
  .string()
  .uuid('Invalid ID format');

/**
 * ID parameter schema (for route params)
 */
export const idParamSchema = z.object({
  id: uuidSchema,
});

/**
 * Name validation schema
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name is too long')
  .trim();

/**
 * Phone validation schema (optional, flexible format)
 */
export const phoneSchema = z
  .string()
  .min(10, 'Phone number is too short')
  .max(20, 'Phone number is too long')
  .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format')
  .optional()
  .nullable();

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .url('Invalid URL')
  .max(2048, 'URL is too long');

/**
 * Optional URL schema
 */
export const optionalUrlSchema = urlSchema.optional().nullable();

/**
 * Date string schema (ISO format)
 */
export const dateStringSchema = z
  .string()
  .datetime('Invalid date format')
  .or(z.string().date('Invalid date format'));

/**
 * Positive integer schema
 */
export const positiveIntSchema = z
  .number()
  .int('Must be a whole number')
  .positive('Must be positive');

/**
 * Non-negative integer schema (includes 0)
 */
export const nonNegativeIntSchema = z
  .number()
  .int('Must be a whole number')
  .nonnegative('Cannot be negative');

/**
 * Price schema (positive number with 2 decimal places max)
 */
export const priceSchema = z
  .number()
  .positive('Price must be positive')
  .multipleOf(0.01, 'Price can have at most 2 decimal places');

/**
 * Sorting schema factory
 */
export function createSortSchema<T extends string>(
  allowedFields: readonly T[],
  defaultField: T
) {
  return z.object({
    sortBy: z.enum(allowedFields as unknown as [T, ...T[]]).default(defaultField),
    order: z.enum(['asc', 'desc']).default('desc'),
  });
}

/**
 * Search query schema
 */
export const searchSchema = z
  .string()
  .max(200, 'Search query is too long')
  .trim()
  .optional();

/**
 * Transform Zod errors to a flat object
 */
export function flattenZodErrors(
  error: z.ZodError
): Record<string, string[]> {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
