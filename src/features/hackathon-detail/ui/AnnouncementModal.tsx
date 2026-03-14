'use client'

import { useQuery } from '@tanstack/react-query'
import { Modal, MarkdownContent } from '@/shared/ui'
import { formatRelativeTime } from '@/shared/lib/formatDate'
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
  // Используем useQuery для реактивного получения данных из кэша
  const { data: announcements } = useQuery<HackathonAnnouncement[]>({
    queryKey: ['hackathon', 'announcements', hackathonId],
    enabled: false,
  })

  if (!open || !announcementId) return null

  const announcement = announcements?.find(a => a.announcementId === announcementId)

  if (!announcement) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={announcement.title}
      subtitle={formatRelativeTime(announcement.createdAt, locale)}
      size="lg"
    >
      <MarkdownContent>{announcement.body}</MarkdownContent>
    </Modal>
  )
}
