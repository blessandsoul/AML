/**
 * Auth cookie utilities for middleware-based route protection
 *
 * These cookies are used by Next.js middleware to determine auth state
 * since middleware cannot access localStorage or Redux state.
 */

const AUTH_COOKIE_NAME = 'auth-token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Set auth cookie when user logs in
 * This cookie indicates to middleware that user is authenticated
 */
export function setAuthCookie(token: string): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

/**
 * Clear auth cookie when user logs out
 */
export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Get auth cookie value (client-side only)
 */
export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === AUTH_COOKIE_NAME) {
      return value;
    }
  }
  return null;
}

/**
 * Check if auth cookie exists (client-side only)
 */
export function hasAuthCookie(): boolean {
  return getAuthCookie() !== null;
}
