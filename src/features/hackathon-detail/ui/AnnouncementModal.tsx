'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Modal, MarkdownContent } from '@/shared/ui'
import { formatRelativeTime } from '@/shared/lib/formatDate'
import { useT } from '@/shared/i18n/useT'
import type { HackathonAnnouncement } from '@/entities/hackathon/api/getHackathonAnnouncements'

export interface AnnouncementModalProps {
  open: boolean
  onClose: () => void
  announcementId: string | null
  hackathonId: string
  locale?: string
}

export function AnnouncementModal({
  open,
  onClose,
  announcementId,
  hackathonId,
  locale = 'ru',
}: AnnouncementModalProps) {
  const t = useT()
  const queryClient = useQueryClient()

  const announcements = queryClient.getQueryData<HackathonAnnouncement[]>([
    'hackathon',
    'announcements',
    hackathonId,
  ])

  if (!open || !announcementId) return null

  const announcement = announcements?.find(a => a.announcementId === announcementId)

  if (!announcement) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={announcement.title ?? t('common.fallback.untitled')}
      subtitle={
        announcement.createdAt ? formatRelativeTime(announcement.createdAt, locale) : undefined
      }
      size="lg"
    >
      <MarkdownContent>{announcement.body ?? ''}</MarkdownContent>
    </Modal>
  )
}
