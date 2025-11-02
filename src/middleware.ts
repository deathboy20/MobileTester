import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/firebase-admin';

// NOTE: The 'runtime' export has been removed to rely on Next.js's default behavior,
// which is what we want now that 'serverComponentsExternalPackages' is configured.

const protectedRoutes = ['/dashboard', '/jobs', '/reports', '/settings'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  // If the user is trying to access a protected route
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      // Verify the cookie
      await auth().verifySessionCookie(sessionCookie, true);
      return NextResponse.next();
    } catch (error) {
      // Cookie is invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If the user is trying to access an auth route
  if (authRoutes.some(route => pathname.startsWith(route))) {
     if (sessionCookie) {
       try {
         await auth().verifySessionCookie(sessionCookie, true);
         // If cookie is valid and they are on an auth page, redirect to dashboard
         return NextResponse.redirect(new URL('/dashboard', request.url));
       } catch (error) {
         // Cookie is invalid, let them proceed to the auth page
         return NextResponse.next();
       }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$).*)',
  ],
}
