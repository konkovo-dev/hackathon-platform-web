import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLoginUrl, isPublicRoute } from '@/shared/config/routes'

/**
 * Защищенные маршруты, требующие авторизации
 */
const protectedRoutes = [
  '/hackathons/create',
  '/hackathons/:id',
  '/profile',
  '/my-teams',
  '/invitations',
]

/**
 * Проверяет, является ли маршрут защищенным
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => {
    const pattern = route.replace(':id', '[^/]+')
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(pathname)
  })
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  if (isProtectedRoute(pathname)) {
    const accessToken = request.cookies.get('hp_access_token')
    
    if (!accessToken) {
      // Редирект на логин с сохранением текущего пути
      const loginUrl = new URL(getLoginUrl(pathname), request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
