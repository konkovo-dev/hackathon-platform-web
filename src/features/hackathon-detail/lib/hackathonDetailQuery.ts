import { routes, type HackathonDetailPathOptions } from '@/shared/config/routes'

export type HackathonDetailTopTab = 'about' | 'participation' | 'management' | 'support' | 'judging'

export type HackathonDetailAboutSection = 'description' | 'task' | 'announcements'

export type HackathonDetailManagementOrg = 'overview' | 'participants' | 'leaderboard'

export interface HackathonDetailQueryState {
  tab: HackathonDetailTopTab
  section: HackathonDetailAboutSection
  org: HackathonDetailManagementOrg
}

const LEGACY_ABOUT_TABS = new Set(['description', 'task', 'announcements'])

const TOP_TABS: HackathonDetailTopTab[] = [
  'about',
  'participation',
  'management',
  'support',
  'judging',
]

function serializeRawHackathonUrl(hackathonId: string, sp: URLSearchParams): string {
  const tab = sp.get('tab')
  const section = sp.get('section')
  const org = sp.get('org')
  if (!tab && !section && !org) {
    return routes.hackathons.detail(hackathonId)
  }
  const p = new URLSearchParams()
  if (tab) p.set('tab', tab)
  if (section) p.set('section', section)
  if (org) p.set('org', org)
  return `${routes.hackathons.detail(hackathonId)}?${p.toString()}`
}

/**
 * Разбор query для страницы хакатона + канонический URL для replace при legacy/лишних параметрах.
 */
export function parseHackathonDetailSearchParams(
  hackathonId: string,
  sp: URLSearchParams
): { state: HackathonDetailQueryState; replaceHref: string | null } {
  const tabRaw = sp.get('tab') ?? ''

  if (LEGACY_ABOUT_TABS.has(tabRaw)) {
    const section = tabRaw as HackathonDetailAboutSection
    const state: HackathonDetailQueryState = {
      tab: 'about',
      section,
      org: 'overview',
    }
    return {
      state,
      replaceHref: routes.hackathons.hackathonDetailPath(hackathonId, { tab: 'about', section }),
    }
  }

  if (tabRaw === 'participants') {
    const state: HackathonDetailQueryState = {
      tab: 'management',
      section: 'description',
      org: 'participants',
    }
    return {
      state,
      replaceHref: routes.hackathons.hackathonDetailPath(hackathonId, {
        tab: 'management',
        org: 'participants',
      }),
    }
  }

  const effectiveTab = tabRaw.trim() === '' ? 'about' : tabRaw
  const safeTab = (
    TOP_TABS.includes(effectiveTab as HackathonDetailTopTab) ? effectiveTab : 'about'
  ) as HackathonDetailTopTab

  let section: HackathonDetailAboutSection = 'description'
  if (safeTab === 'about') {
    const s = sp.get('section')?.trim() || 'description'
    section = (
      s === 'description' || s === 'task' || s === 'announcements' ? s : 'description'
    ) as HackathonDetailAboutSection
  }

  let org: HackathonDetailManagementOrg = 'overview'
  if (safeTab === 'management') {
    const o = sp.get('org')?.trim() || 'overview'
    org = (
      o === 'participants' || o === 'leaderboard' ? o : 'overview'
    ) as HackathonDetailManagementOrg
  }

  const state: HackathonDetailQueryState = { tab: safeTab, section, org }

  const canonicalHref = routes.hackathons.hackathonDetailPath(hackathonId, {
    tab: state.tab,
    ...(state.tab === 'about' ? { section: state.section } : {}),
    ...(state.tab === 'management' ? { org: state.org } : {}),
  })

  const rawHref = serializeRawHackathonUrl(hackathonId, sp)
  const replaceHref = canonicalHref !== rawHref ? canonicalHref : null

  return { state, replaceHref }
}

export function hackathonDetailPathOptionsFromState(
  state: HackathonDetailQueryState
): HackathonDetailPathOptions {
  if (state.tab === 'about') {
    return { tab: 'about', section: state.section }
  }
  if (state.tab === 'management') {
    return { tab: 'management', org: state.org }
  }
  return { tab: state.tab }
}

export function serializeHackathonDetailUrlFromProps(
  hackathonId: string,
  tab?: string | null,
  section?: string | null,
  org?: string | null
): string {
  const p = new URLSearchParams()
  if (tab) p.set('tab', tab)
  if (section) p.set('section', section)
  if (org) p.set('org', org)
  const qs = p.toString()
  return qs
    ? `${routes.hackathons.detail(hackathonId)}?${qs}`
    : routes.hackathons.detail(hackathonId)
}
