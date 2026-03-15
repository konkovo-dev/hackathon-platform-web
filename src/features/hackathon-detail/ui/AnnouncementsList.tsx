'use client'

import { useState } from 'react'
import { ListItem } from '@/shared/ui'
import { formatRelativeTime } from '@/shared/lib/formatDate'
import { useT } from '@/shared/i18n/useT'
import type { HackathonAnnouncement } from '@/entities/hackathon/api/getHackathonAnnouncements'
import { AnnouncementModal } from './AnnouncementModal'

export interface AnnouncementsListProps {
  announcements: HackathonAnnouncement[]
  hackathonId: string
  locale?: string
}

export function AnnouncementsList({ announcements, hackathonId, locale = 'ru' }: AnnouncementsListProps) {
  const t = useT()
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null)

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
    <>
      <div className="flex flex-col gap-m4">
        {announcements.map(announcement => (
          <ListItem
            key={announcement.announcementId ?? 'unknown'}
            text={announcement.title ?? t('common.fallback.untitled')}
            caption={announcement.createdAt ? formatRelativeTime(announcement.createdAt, locale) : undefined}
            variant="section"
            onClick={() => announcement.announcementId && setSelectedAnnouncementId(announcement.announcementId)}
          />
        ))}
      </div>

      <AnnouncementModal
        open={!!selectedAnnouncementId}
        onClose={() => setSelectedAnnouncementId(null)}
        announcementId={selectedAnnouncementId}
        hackathonId={hackathonId}
        locale={locale}
      />
    </>
  )
}
