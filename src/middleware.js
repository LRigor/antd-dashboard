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
  '/register'
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
  
  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user has token and tries to access login/register, redirect to dashboard
  if (token && (pathname === '/' || pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Forward only API requests to external API if NEXT_PUBLIC_API_URL is set
  if (pathname.startsWith('/api/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (apiUrl && apiUrl !== request.nextUrl.origin) {
      // Forward the API request to the external API
      const externalUrl = new URL(pathname, apiUrl);
      externalUrl.search = request.nextUrl.search;
      
      // Create headers for the external request
      const requestHeaders = new Headers(request.headers);
      if (token) {
        requestHeaders.set('Authorization', `Bearer ${token}`);
      }
      
      // Forward the request to external API
      return NextResponse.rewrite(externalUrl, {
        request: {
          headers: requestHeaders,
        },
      });
    }
  }
  
  // Add token to headers for any route if available
  if (token) {
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