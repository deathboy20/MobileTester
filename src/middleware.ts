import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/jobs', '/reports', '/settings'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  // If the user is trying to access a protected route without a session, redirect to login
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If the user is authenticated and tries to access an auth route, redirect to dashboard
  if (authRoutes.some(route => pathname.startsWith(route))) {
     if (sessionCookie) {
         return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$).*)',
  ],
}
