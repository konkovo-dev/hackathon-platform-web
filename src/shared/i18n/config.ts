export const I18N_COOKIE_NAME = 'hp_locale'

export const LOCALES = ['ru', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'ru'

// Держим неймспейсы явно — так проще делать code-splitting / per-route загрузку позже
export const NAMESPACES = [
  'common',
  'auth',
  'home',
  'hackathons',
  'profile',
  'invitations',
  'teams',
  'sidebar',
  'settings',
] as const
export type Namespace = (typeof NAMESPACES)[number]
