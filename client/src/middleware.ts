import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Protected paths that require authentication
 */
const protectedPaths = [
  '/profile',
  '/settings',
  '/messages',
  '/dealer',
  '/admin',
];

/**
 * Auth paths that authenticated users should be redirected away from
 */
const authPaths = ['/login', '/register'];

/**
 * Cookie name for auth indicator
 * This cookie is set by client-side auth hooks to indicate login state
 */
const AUTH_COOKIE_NAME = 'auth-token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth token in cookies
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Check if accessing a protected route
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Check if accessing an auth page (login/register)
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Redirect to login if accessing protected route without token
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to profile if accessing auth pages while logged in
  if (isAuthPath && token) {
    // Check for 'from' param to redirect back to intended page
    const from = request.nextUrl.searchParams.get('from');
    const redirectUrl = from || '/profile';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    '/profile/:path*',
    '/settings/:path*',
    '/messages/:path*',
    '/dealer/:path*',
    '/admin/:path*',
    // Auth routes
    '/login',
    '/register',
  ],
};
