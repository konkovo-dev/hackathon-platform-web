'use client'

import Link from 'next/link'
import { Section, Icon, ListItem } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'
import type { Hackathon } from '@/entities/hackathon/model/types'

export interface UpcomingEventsProps {
  hackathons: Hackathon[]
  className?: string
}

interface Event {
  hackathonId: string
  hackathonName: string
  date: string
  type: 'registration_ends' | 'hackathon_starts' | 'hackathon_ends' | 'judging_ends'
  daysUntil: number
}

function getUpcomingEvents(hackathons: Hackathon[]): Event[] {
  const now = new Date()
  const events: Event[] = []

  hackathons.forEach(hackathon => {
    if (!hackathon.dates || !hackathon.hackathonId || !hackathon.name) return

    if (hackathon.dates.registrationOpensAt) {
      const regDate = hackathon.dates.registrationOpensAt
      const date = new Date(regDate)
      if (date > now) {
        const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        events.push({
          hackathonId: hackathon.hackathonId,
          hackathonName: hackathon.name,
          date: regDate,
          type: 'registration_ends',
          daysUntil,
        })
      }
    }

    if (hackathon.dates.startsAt) {
      const startDate = hackathon.dates.startsAt
      const date = new Date(startDate)
      if (date > now) {
        const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        events.push({
          hackathonId: hackathon.hackathonId,
          hackathonName: hackathon.name,
          date: startDate,
          type: 'hackathon_starts',
          daysUntil,
        })
      }
    }

    if (hackathon.dates.endsAt) {
      const endDate = hackathon.dates.endsAt
      const date = new Date(endDate)
      if (date > now) {
        const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        events.push({
          hackathonId: hackathon.hackathonId,
          hackathonName: hackathon.name,
          date: endDate,
          type: 'hackathon_ends',
          daysUntil,
        })
      }
    }

    if (hackathon.dates.judgingEndsAt) {
      const judgingDate = hackathon.dates.judgingEndsAt
      const date = new Date(judgingDate)
      if (date > now) {
        const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        events.push({
          hackathonId: hackathon.hackathonId,
          hackathonName: hackathon.name,
          date: judgingDate,
          type: 'judging_ends',
          daysUntil,
        })
      }
    }
  })

  return events.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 5)
}

function formatDaysUntil(days: number, t: ReturnType<typeof useT>): string {
  if (days === 0) return t('dashboard.upcoming.today')
  if (days === 1) return t('dashboard.upcoming.tomorrow')

  return t('dashboard.upcoming.in_days', { count: days })
}

export function UpcomingEvents({ hackathons, className }: UpcomingEventsProps) {
  const t = useT()
  const events = getUpcomingEvents(hackathons)

  return (
    <Section
      title={t('dashboard.upcoming.title')}
      variant="elevated"
      className={cn('animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200', className)}
    >
      {events.length === 0 ? (
        <div className="flex items-center justify-center p-m20">
          <span className="typography-body-md-regular text-text-tertiary">
            {t('dashboard.upcoming.empty')}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-m4">
          {events.map(event => (
            <Link
              key={`${event.hackathonId}-${event.type}`}
              href={routes.hackathons.detail(event.hackathonId)}
            >
              <ListItem
                variant="bordered"
                text={event.hackathonName}
                subtitle={t(`dashboard.upcoming.${event.type}`)}
                caption={formatDaysUntil(event.daysUntil, t)}
                onClick={() => {}}
              />
            </Link>
          ))}
        </div>
      )}
    </Section>
  )
}
