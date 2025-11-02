import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/jobs', '/reports', '/settings'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  // This is a placeholder. In a real app, you would check for a valid session cookie.
  const isAuthenticated = true; // Assume user is authenticated for now.

  const { pathname } = request.nextUrl;

  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$).*)',
  ],
}
