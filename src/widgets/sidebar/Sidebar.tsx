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

type SidebarItem = {
  key:
    | 'hackathons'
    | 'invitations'
    | 'teams'
    | 'profile'
    | 'auth'
    | 'settings'
  href: string
  iconSrc: string
}

const ICONS = {
  code: '/icons/icon-code/icon-code-md.svg',
  mail: '/icons/icon-mail/icon-mail-md.svg',
  team: '/icons/icon-team/iton-team-md.svg',
  profile: '/icons/icon-profile/icon-profile-md.svg',
  auth: '/icons/icon-auth/icon-auth-md.svg',
  settings: '/icons/icon-settings/icon-settings-md.svg',
  sidebar: '/icons/icon-sidebar/icon-sidebar-md.svg',
  arrowRight: '/icons/icon-arrow/icon-arrow-right-md.svg',
} as const

const LABEL_KEY: Record<SidebarItem['key'], I18nKey> = {
  hackathons: 'sidebar.items.hackathons',
  invitations: 'sidebar.items.invitations',
  teams: 'sidebar.items.teams',
  profile: 'sidebar.items.profile',
  auth: 'sidebar.items.auth',
  settings: 'sidebar.items.settings',
}

export function Sidebar() {
  const t = useT()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const items: SidebarItem[] = useMemo(
    () => [
      { key: 'hackathons', href: '/hackathons', iconSrc: ICONS.code },
      { key: 'invitations', href: '/invitations', iconSrc: ICONS.mail },
      { key: 'teams', href: '/my-teams', iconSrc: ICONS.team },
      { key: 'profile', href: '/profile', iconSrc: ICONS.profile },
      { key: 'auth', href: '/login', iconSrc: ICONS.auth },
      { key: 'settings', href: '/settings', iconSrc: ICONS.settings },
    ],
    []
  )

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
        {items.map(item => (
          <MenuItem
            key={item.key}
            href={item.href}
            iconSrc={item.iconSrc}
            title={t(LABEL_KEY[item.key])}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}

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

      <div className="mt-auto p-m8">
        {!collapsed && (
          <div className="text-text-tertiary typography-caption-xs">
            {t('sidebar.footer')}
          </div>
        )}
      </div>
    </aside>
  )
}
