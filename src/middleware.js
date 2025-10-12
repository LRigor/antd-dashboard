import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/settings', '/api/protected'];
const publicRoutes = ['/', '/login', '/register','/adminlogin'];

export function middleware(request) { const { pathname, origin, search } = request.nextUrl;





function withDebug(resp, info) {
  resp.headers.set('x-debug-mw', info);
  return resp;
}


  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // ✅ 重點：讀正確的 cookie 名稱（可兼容舊名）
  const token =
    request.cookies.get('token')?.value ||
    request.cookies.get('auth-token')?.value ||
    '';

  // 帶上 namespace（無則預設 '1'）
  const namespace = request.cookies.get('namespace')?.value || '1';

  // Middleware entry

  // 未登入且訪問保護路由 → 轉去登入
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    // Protected route redirect
    return withDebug(NextResponse.redirect(loginUrl), `redirect->/adminlogin from ${pathname}`);
  }

  // 已登入卻訪問公開頁 → 轉去 dashboard
  if (token && (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/adminlogin')) {
    return withDebug(NextResponse.redirect(new URL('/dashboard', request.url)), `redirect->/dashboard from ${pathname}`);
  }

  // ---- 轉發 /api/* 到外部 API：帶 Authorization + namespace ----
  if (pathname.startsWith('/api/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl && apiUrl !== origin) {
      const externalUrl = new URL(pathname + search, apiUrl);
      // Rewrite to external API

      const requestHeaders = new Headers(request.headers);
      if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
      requestHeaders.set('namespace', namespace);

      return withDebug(NextResponse.rewrite(externalUrl, { request: { headers: requestHeaders } }), `rewrite->${externalUrl}`);
    }
  }

  // ---- 其他路由也把 header 補上（如有需要）----
  const requestHeaders = new Headers(request.headers);
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
  requestHeaders.set('namespace', namespace);

 // 預設放行（在這裡也打點）
const next = NextResponse.next({ request: { headers: requestHeaders } });
return withDebug(next, `next ${pathname}`);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
