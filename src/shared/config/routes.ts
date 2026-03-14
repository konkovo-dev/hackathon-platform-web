/**
 * Централизованный конфиг маршрутов приложения
 */
export const routes = {
  auth: {
    login: '/login',
    register: '/register',
  },
  hackathons: {
    list: '/hackathons',
    create: '/hackathons/create',
    detail: (id: string) => `/hackathons/${id}`,
    edit: (id: string) => `/hackathons/${id}/edit`,
  },
  profile: '/profile',
  teams: '/my-teams',
  invitations: '/invitations',
} as const

/**
 * Создает URL для логина с редиректом
 */
export function getLoginUrl(redirectTo?: string): string {
  const redirect = redirectTo || (typeof window !== 'undefined' ? window.location.pathname : '')
  return `${routes.auth.login}${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`
}

/**
 * Проверяет, является ли путь публичным (не требует авторизации)
 */
export function isPublicRoute(path: string): boolean {
  return path.startsWith(routes.auth.login) || path.startsWith(routes.auth.register)
}
