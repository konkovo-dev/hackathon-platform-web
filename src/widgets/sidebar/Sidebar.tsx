'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { routes } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button'
import { Divider } from '@/shared/ui/Divider'
import { Icon } from '@/shared/ui/Icon'
import { Logo } from '@/shared/ui/Logo'
import { MenuItem } from '@/shared/ui/MenuItem'
import { useT } from '@/shared/i18n/useT'
import type { I18nKey } from '@/shared/i18n/generated'
import { useSessionQueryWithInitial } from '@/features/auth/model/hooks'
import type { components as AuthBffComponents } from '@/shared/api/authBff.schema'
import { useActiveInvitationsCount } from '@/features/invitations-management'
import { SidebarSettings } from './SidebarSettings'
import { useDebugFlag } from './useDebugFlag'

type SessionResponse = AuthBffComponents['schemas']['BffSessionResponse']

type SidebarItem = {
  key: 'home' | 'hackathons' | 'invitations' | 'teams' | 'profile' | 'auth' | 'design_system'
  href: string
  iconSrc: string
}

const ICONS = {
  home: '/icons/icon-home/icon-home-md.svg',
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
  home: 'sidebar.items.home',
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
  const { count: invitationsCount } = useActiveInvitationsCount()

  const menuGroups = useMemo(() => {
    const groups: SidebarItem[][] = []

    if (isAuthed) {
      groups.push([
        { key: 'home', href: routes.home, iconSrc: ICONS.home },
        { key: 'profile', href: routes.profile, iconSrc: ICONS.profile },
      ])
    } else {
      groups.push([{ key: 'auth', href: routes.auth.login, iconSrc: ICONS.auth }])
    }

    const otherGroup: SidebarItem[] = [
      { key: 'hackathons', href: routes.hackathons.list, iconSrc: ICONS.code },
    ]
    if (isAuthed) {
      otherGroup.push(
        { key: 'invitations', href: routes.invitations, iconSrc: ICONS.mail },
        { key: 'teams', href: routes.teams, iconSrc: ICONS.team }
      )
    }
    if (debug) {
      otherGroup.push({ key: 'design_system', href: '/design-system', iconSrc: ICONS.designSystem })
    }
    groups.push(otherGroup)

    return groups
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
      <div
        className={cn(
          'flex items-center',
          collapsed ? 'justify-center' : 'justify-between',
          'p-m8'
        )}
      >
        <Link href={routes.home}>
          <Logo size={collapsed ? 'sm' : 'md'} />
        </Link>
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
          'flex-1 flex flex-col items-center overflow-y-auto',
          'transition-[padding] duration-200 ease-in-out motion-reduce:transition-none',
          'px-m4 gap-m2'
        )}
      >
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="w-full flex flex-col gap-m2">
            {group.map(item => (
              <MenuItem
                key={item.key}
                href={item.href}
                iconSrc={item.iconSrc}
                title={t(LABEL_KEY[item.key])}
                active={isActive(item.href)}
                collapsed={collapsed}
                badge={item.key === 'invitations' ? invitationsCount : undefined}
              />
            ))}
            {groupIndex < menuGroups.length - 1 && <Divider className="my-m2" />}
          </div>
        ))}

        <SidebarSettings
          collapsed={collapsed}
          pathname={pathname}
          debug={debug}
          setDebug={setDebug}
        />

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
