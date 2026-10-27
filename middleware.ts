import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isDashboard = nextUrl.pathname.startsWith('/dashboard');
  const isAdmin = nextUrl.pathname.startsWith('/admin');

  if (isDashboard || isAdmin) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', nextUrl.origin);
      loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdmin && role !== 'admin') {
      return NextResponse.redirect(new URL('/403', nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};

