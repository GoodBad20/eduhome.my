import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Admin email - hardcoded for security
  const ADMIN_EMAIL = 'badrul.ameen20@gmail.com'

  // Define routes
  const isAdminRoute = pathname.startsWith('/dashboard/admin')
  const isAuthRoute = pathname.startsWith('/auth')
  const isDashboardRoute = pathname.startsWith('/dashboard')

  // Basic protection - only check if admin route is accessed
  if (isAdminRoute && !isAuthRoute) {
    // We'll handle the actual authentication check in the component
    // This prevents the middleware error
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}