export type HackathonDetailPathTab =
  | 'about'
  | 'participation'
  | 'management'
  | 'support'
  | 'judging'

export type HackathonDetailPathSection = 'description' | 'task' | 'announcements'

export type HackathonDetailPathOrg = 'overview' | 'participants' | 'leaderboard'

export interface HackathonDetailPathOptions {
  tab?: HackathonDetailPathTab
  section?: HackathonDetailPathSection
  org?: HackathonDetailPathOrg
}

/**
 * Канонический URL страницы хакатона (верхний таб + вложенные section/org).
 */
export function hackathonDetailPath(
  hackathonId: string,
  options?: HackathonDetailPathOptions
): string {
  const tab = options?.tab ?? 'about'
  const section = options?.section ?? 'description'
  const org = options?.org ?? 'overview'
  const base = `/hackathons/${hackathonId}`

  if (tab === 'about') {
    if (section === 'description') {
      return base
    }
    const p = new URLSearchParams()
    p.set('tab', 'about')
    p.set('section', section)
    return `${base}?${p.toString()}`
  }

  if (tab === 'management') {
    const p = new URLSearchParams()
    p.set('tab', 'management')
    if (org !== 'overview') {
      p.set('org', org)
    }
    return `${base}?${p.toString()}`
  }

  const p = new URLSearchParams()
  p.set('tab', tab)
  return `${base}?${p.toString()}`
}

function hackathonDetailPathFromLegacyTab(hackathonId: string, tab?: string): string {
  if (tab == null || tab === '' || tab === 'description') {
    return hackathonDetailPath(hackathonId)
  }
  if (tab === 'task') {
    return hackathonDetailPath(hackathonId, { tab: 'about', section: 'task' })
  }
  if (tab === 'announcements') {
    return hackathonDetailPath(hackathonId, { tab: 'about', section: 'announcements' })
  }
  if (tab === 'participants') {
    return hackathonDetailPath(hackathonId, { tab: 'management', org: 'participants' })
  }
  if (
    tab === 'about' ||
    tab === 'participation' ||
    tab === 'management' ||
    tab === 'support' ||
    tab === 'judging'
  ) {
    return hackathonDetailPath(hackathonId, { tab })
  }
  return hackathonDetailPath(hackathonId)
}

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
    hackathonDetailPath,
    detailWithTab: (id: string, tab?: string) => hackathonDetailPathFromLegacyTab(id, tab),
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
