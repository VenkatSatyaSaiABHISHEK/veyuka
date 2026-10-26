import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /console/* routes
  if (pathname.startsWith('/console')) {
    const sessionCookie = request.cookies.get('veyuka_session');
    
    // If no session cookie, redirect to /login
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect root '/' to '/showcase'
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/showcase', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/console/:path*'],
};
