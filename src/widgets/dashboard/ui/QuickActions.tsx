'use client'

import Link from 'next/link'
import { Button, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'

export interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  const t = useT()

  const actions = [
    {
      label: t('dashboard.quick_actions.find_hackathons'),
      href: routes.hackathons.list,
      icon: '/icons/icon-search/icon-search-md.svg',
      variant: 'secondary' as const,
    },
    {
      label: t('dashboard.quick_actions.my_teams'),
      href: routes.teams,
      icon: '/icons/icon-team/iton-team-md.svg',
      variant: 'secondary' as const,
    },
    {
      label: t('dashboard.quick_actions.invitations'),
      href: routes.invitations,
      icon: '/icons/icon-mail/icon-mail-md.svg',
      variant: 'secondary' as const,
    },
    {
      label: t('dashboard.quick_actions.create_hackathon'),
      href: routes.hackathons.create,
      icon: '/icons/icon-plus/icon-plus-md.svg',
      variant: 'secondary' as const,
    },
  ]

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-m4',
        'animate-in fade-in slide-in-from-top-2 duration-300',
        className
      )}
    >
      {actions.map((action, index) => (
        <Link key={action.href} href={action.href}>
          <Button
            variant={action.variant}
            size="lg"
            className="w-full h-[80px] flex flex-col gap-m2"
          >
            <Icon src={action.icon} size="md" />
            <span className="typography-body-sm-medium">{action.label}</span>
          </Button>
        </Link>
      ))}
    </div>
  )
}
