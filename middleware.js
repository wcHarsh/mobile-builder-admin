import { NextResponse } from 'next/server'

export function middleware(request) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('auth-token')?.value
    const authRoutes = ['/login', '/signup']
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // Check if this is an error page with session expired
    const isErrorPage = pathname.includes('/error') || pathname.includes('/_error')

    console.log('Middleware - pathname:', pathname, 'isErrorPage:', isErrorPage, 'token:', !!token)

    // Don't redirect if it's an error page (let the error page handle the redirect)
    if (isErrorPage) {
        console.log('Middleware - Skipping redirect for error page')
        return NextResponse.next()
    }

    if (isAuthRoute && token) {
        console.log('Middleware - Redirecting to dashboard (auth route with token)')
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!isAuthRoute && !token && pathname !== '/') {
        console.log('Middleware - Redirecting to login (no token)')
        return NextResponse.redirect(new URL('/login', request.url))
    }

    console.log('Middleware - No redirect needed')
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)',
    ],
}
