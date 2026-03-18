/**
 * Централизованный конфиг маршрутов приложения
 */
export const routes = {
  home: '/',
  auth: {
    login: '/login',
    register: '/register',
  },
  hackathons: {
    list: '/hackathons',
    create: '/hackathons/create',
    detail: (id: string) => `/hackathons/${id}`,
    detailWithTab: (id: string, tab?: string) =>
      !tab || tab === 'description' ? `/hackathons/${id}` : `/hackathons/${id}?tab=${tab}`,
    edit: (id: string) => `/hackathons/${id}/edit`,
    teams: {
      list: (hackathonId: string) => `/hackathons/${hackathonId}/teams`,
      detail: (hackathonId: string, teamId: string) => `/hackathons/${hackathonId}/teams/${teamId}`,
    },
  },
  profile: '/profile',
  user: (id: string) => `/users/${id}`,
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
 * 
 * Публичные маршруты:
 * - /login - страница входа
 * - /register - страница регистрации
 * - /hackathons - список хакатонов
 * - /hackathons/:id - детальная страница хакатона
 * 
 * Защищенные маршруты (требуют авторизации):
 * - /hackathons/create - создание хакатона
 * - /hackathons/:id/edit - редактирование хакатона
 * - /profile - профиль пользователя
 * - /my-teams - команды пользователя
 * - /invitations - приглашения
 */
export function isPublicRoute(path: string): boolean {
  return (
    path.startsWith(routes.auth.login) ||
    path.startsWith(routes.auth.register) ||
    path === routes.hackathons.list ||
    /^\/hackathons\/[^/]+$/.test(path)
  )
}
