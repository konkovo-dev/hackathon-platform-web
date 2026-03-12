'use client'

import { ListItem } from '@/shared/ui'
import { formatRelativeTime } from '@/shared/lib/formatDate'
import { useT } from '@/shared/i18n/useT'
import type { HackathonAnnouncement } from '@/entities/hackathon/api/getHackathonAnnouncements'

export interface AnnouncementsListProps {
  announcements: HackathonAnnouncement[]
  locale?: string
}

export function AnnouncementsList({ announcements, locale = 'ru' }: AnnouncementsListProps) {
  const t = useT()

  if (announcements.length === 0) {
    return (
      <div className="py-m8">
        <p className="typography-body-md text-text-secondary">
          {t('hackathons.detail.announcements_coming_soon')}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {announcements.map(announcement => (
        <ListItem
          key={announcement.announcementId}
          text={announcement.text}
          caption={formatRelativeTime(announcement.createdAt, locale)}
        />
      ))}
    </div>
  )
}
