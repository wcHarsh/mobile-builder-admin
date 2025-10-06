import { NextResponse } from 'next/server'

export function middleware(request) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('auth-token')?.value
    const authRoutes = ['/login', '/signup']
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!isAuthRoute && !token && pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)',
    ],
}
