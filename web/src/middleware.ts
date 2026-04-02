import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PREVIEW_KEY = 'atelier2026';
const COOKIE_NAME = 'ap_preview';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Allow Next.js internals and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/locked' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/CNAME' ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|woff|woff2|ttf|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Check unlock param — sets cookie and redirects cleanly
  const param = searchParams.get('p');
  if (param === PREVIEW_KEY) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('p');
    const res = NextResponse.redirect(url);
    res.cookies.set(COOKIE_NAME, PREVIEW_KEY, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 90, // 90 zile
    });
    return res;
  }

  // Check cookie
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value === PREVIEW_KEY) {
    return NextResponse.next();
  }

  // Block — redirect to locked page
  const locked = request.nextUrl.clone();
  locked.pathname = '/locked';
  locked.search = '';
  return NextResponse.redirect(locked);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
