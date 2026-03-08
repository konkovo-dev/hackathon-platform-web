import { DEFAULT_LOCALE, type Locale, type Namespace } from './config'
import type { MessagesTree } from './types'

// Явные импорты нужны, чтобы Next/webpack гарантированно включал JSON в бандл.
const loaders = {
  ru: {
    common: () => import('./locales/ru/common.json'),
    auth: () => import('./locales/ru/auth.json'),
    home: () => import('./locales/ru/home.json'),
    hackathons: () => import('./locales/ru/hackathons.json'),
    profile: () => import('./locales/ru/profile.json'),
    invitations: () => import('./locales/ru/invitations.json'),
    teams: () => import('./locales/ru/teams.json'),
    sidebar: () => import('./locales/ru/sidebar.json'),
    settings: () => import('./locales/ru/settings.json'),
  },
  en: {
    common: () => import('./locales/en/common.json'),
    auth: () => import('./locales/en/auth.json'),
    home: () => import('./locales/en/home.json'),
    hackathons: () => import('./locales/en/hackathons.json'),
    profile: () => import('./locales/en/profile.json'),
    invitations: () => import('./locales/en/invitations.json'),
    teams: () => import('./locales/en/teams.json'),
    sidebar: () => import('./locales/en/sidebar.json'),
    settings: () => import('./locales/en/settings.json'),
  },
} satisfies Record<Locale, Record<Namespace, () => Promise<{ default: MessagesTree }>>>

export const loadNamespaces = async (locale: Locale, namespaces: readonly Namespace[]) => {
  const safeLocale = loaders[locale] ? locale : DEFAULT_LOCALE

  const entries = await Promise.all(
    namespaces.map(async ns => {
      const mod = await loaders[safeLocale][ns]()
      return [ns, mod.default] as const
    })
  )

  return Object.fromEntries(entries) as MessagesTree
}
