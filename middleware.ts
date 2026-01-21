import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 旧WordPress/不要なクエリパラメータをブロック
const BLOCKED_PARAMS = ['author', 'm', 'p', 'page_id', 'a8'];

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  
  // トップページのみチェック
  if (pathname === '/') {
    for (const param of BLOCKED_PARAMS) {
      if (searchParams.has(param)) {
        // 404を返す
        return NextResponse.rewrite(new URL('/not-found', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
