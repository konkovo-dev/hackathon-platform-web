'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Icon } from '@/shared/ui/Icon'
import { Logo } from '@/shared/ui/Logo'
import { MenuItem } from '@/shared/ui/MenuItem'
import { useT } from '@/shared/i18n/useT'
import type { I18nKey } from '@/shared/i18n/generated'
import { useSessionQueryWithInitial } from '@/features/auth/model/hooks'
import type { components as AuthBffComponents } from '@/shared/api/authBff.schema'
import { SidebarSettings } from './SidebarSettings'
import { useDebugFlag } from './useDebugFlag'

type SessionResponse = AuthBffComponents['schemas']['BffSessionResponse']

type SidebarItem = {
  key:
    | 'hackathons'
    | 'invitations'
    | 'teams'
    | 'profile'
    | 'auth'
    | 'design_system'
  href: string
  iconSrc: string
}

const ICONS = {
  code: '/icons/icon-code/icon-code-md.svg',
  mail: '/icons/icon-mail/icon-mail-md.svg',
  team: '/icons/icon-team/iton-team-md.svg',
  profile: '/icons/icon-profile/icon-profile-md.svg',
  auth: '/icons/icon-auth/icon-auth-md.svg',
  designSystem: '/icons/icon-code/icon-code-md.svg',
  sidebar: '/icons/icon-sidebar/icon-sidebar-md.svg',
  arrowRight: '/icons/icon-arrow/icon-arrow-right-md.svg',
} as const

const LABEL_KEY: Record<SidebarItem['key'], I18nKey> = {
  hackathons: 'sidebar.items.hackathons',
  invitations: 'sidebar.items.invitations',
  teams: 'sidebar.items.teams',
  profile: 'sidebar.items.profile',
  auth: 'sidebar.items.auth',
  design_system: 'sidebar.items.design_system',
}

export function Sidebar({ initialSession }: { initialSession?: SessionResponse }) {
  const t = useT()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { debug, setDebug } = useDebugFlag({ cookieName: 'hp_debug' })
  const sessionQuery = useSessionQueryWithInitial(initialSession)
  const isAuthed = sessionQuery.data?.active === true

  const items: SidebarItem[] = useMemo(() => {
    const base: SidebarItem[] = [{ key: 'hackathons', href: '/hackathons', iconSrc: ICONS.code }]

    if (isAuthed) {
      base.push(
        { key: 'invitations', href: '/invitations', iconSrc: ICONS.mail },
        { key: 'teams', href: '/my-teams', iconSrc: ICONS.team },
        { key: 'profile', href: '/profile', iconSrc: ICONS.profile }
      )
    } else {
      base.push({ key: 'auth', href: '/login', iconSrc: ICONS.auth })
    }

    if (debug) {
      base.push({ key: 'design_system', href: '/design-system', iconSrc: ICONS.designSystem })
    }

    return base
  }, [debug, isAuthed])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 flex flex-col',
        'bg-bg-default',
        'transition-[width] duration-200 ease-in-out motion-reduce:transition-none',
        collapsed ? 'w-[80px]' : 'w-[240px]'
      )}
    >
      <div className={cn('flex items-center', collapsed ? 'justify-center' : 'justify-between', 'p-m8')}>
        <Logo size={collapsed ? 'sm' : 'md'} />
        {!collapsed && (
          <Button
            variant="icon"
            size="sm"
            type="button"
            aria-label={t('sidebar.collapse')}
            onClick={() => setCollapsed(true)}
          >
            <Icon src={ICONS.sidebar} size="md" color="secondary" />
          </Button>
        )}
      </div>

      <nav
        className={cn(
          'flex flex-col items-center',
          'transition-[padding] duration-200 ease-in-out motion-reduce:transition-none',
          'px-m4 gap-m2'
        )}
      >
        {items.map((item) => (
          <MenuItem
            key={item.key}
            href={item.href}
            iconSrc={item.iconSrc}
            title={t(LABEL_KEY[item.key])}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}

        <SidebarSettings collapsed={collapsed} pathname={pathname} debug={debug} setDebug={setDebug} />

        {collapsed && (
          <Button
            variant="icon"
            size="sm"
            type="button"
            aria-label={t('sidebar.expand')}
            onClick={() => setCollapsed(false)}
            className="mt-m4"
          >
            <Icon src={ICONS.arrowRight} size="md" color="secondary" />
          </Button>
        )}
      </nav>

      {/* <div className="mt-auto p-m8">
        {!collapsed && <div className="text-text-tertiary typography-caption-xs">{t('sidebar.footer')}</div>}
      </div> */}
    </aside>
  )
}
