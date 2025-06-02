import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { nextUrl } = request
  const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                      request.cookies.get('__Secure-next-auth.session-token')?.value ||
                      request.cookies.get('authjs.session-token')?.value ||
                      request.cookies.get('__Secure-authjs.session-token')?.value
  
  const isLoggedIn = !!sessionToken

  const isPublicRoute = [
    '/',
    '/about',
    '/auth/signin',
    '/auth/signup', 
    '/auth/error'
  ].some(route => nextUrl.pathname.startsWith(route))

  if (nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const isProtectedRoute = [
    '/dashboard',
    '/profile',
    '/vocabulary',
    '/settings',
    '/learn',
    '/stories'
  ].some(route => nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl))
  }

  if (isLoggedIn && nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }
  return NextResponse.next()
}

export default middleware

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|.*\\..*$).*)',
  ],
}
