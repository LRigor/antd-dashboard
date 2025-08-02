import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/api/protected'
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout'
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  console.log('Middleware - Path:', pathname);
  console.log('Middleware - Is protected route:', isProtectedRoute);
  console.log('Middleware - Token in cookies:', token ? 'exists' : 'null');
  
  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !token) {
    console.log('Middleware - Redirecting to login (no token for protected route)');
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user has token and tries to access login/register, redirect to dashboard
  if (token && (pathname === '/' || pathname === '/login' || pathname === '/register')) {
    console.log('Middleware - Redirecting to dashboard (authenticated user on auth pages)');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Add token to request headers for API routes
  if (pathname.startsWith('/api/') && token) {
    console.log('Middleware - Adding token to API request headers');
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${token}`);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 