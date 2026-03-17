'use client'

import { cn } from '@/shared/lib/cn'
import { Modal, MarkdownContent, Section } from '@/shared/ui'
import { UserListItem } from '@/entities/user'
import { HackathonListItem } from '@/entities/hackathon'
import { useT } from '@/shared/i18n/useT'
import type { User } from '@/entities/user/api/listUsers'
import type { Hackathon } from '@/entities/hackathon'
import { useQuery } from '@tanstack/react-query'
import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export interface InvitationMessageModalProps {
  open: boolean
  onClose: () => void
  message: string
  title?: string
  createdByUserId?: string
  createdByUser?: User
  hackathonId?: string
  showHackathon?: boolean
}

export function InvitationMessageModal({
  open,
  onClose,
  message,
  title,
  createdByUserId,
  createdByUser,
  hackathonId,
  showHackathon = true,
}: InvitationMessageModalProps) {
  const t = useT()

  const { data: hackathonData } = useQuery({
    queryKey: ['hackathon', hackathonId],
    queryFn: async () => {
      if (!hackathonId) return null
      const response = await platformFetchJson<
        operations['HackathonService_GetHackathon']['responses']['200']['content']['application/json']
      >(`/v1/hackathons/${hackathonId}`, { method: 'GET' })
      return response.hackathon
    },
    enabled: !!hackathonId && showHackathon,
  })

  return (
    <Modal open={open} onClose={onClose} title={title || t('invitations.messageModal.title')} size="md">
      <div className="flex flex-col gap-m8">
        <div
          className={cn(
            (createdByUserId || (showHackathon && hackathonId)) &&
              (showHackathon && hackathonId && createdByUserId ? 'grid grid-cols-2 gap-m4' : 'flex flex-col gap-m4')
          )}
        >
          {createdByUserId && (
            <UserListItem
              userId={createdByUserId}
              user={createdByUser}
              variant="bordered"
              showNavigationIcon={true}
            />
          )}

          {showHackathon && hackathonId && (
            <HackathonListItem
              hackathon={hackathonData as any}
              hackathonId={hackathonId}
              variant="bordered"
            />
          )}
        </div>

        {message ? (
          <Section title={t('invitations.messageModal.message')} variant="outlined">
            <MarkdownContent>{message}</MarkdownContent>
          </Section>
        ) : (
          <p className="typography-body-sm text-text-secondary">
            {t('invitations.messageModal.noMessage')}
          </p>
        )}
      </div>
    </Modal>
  )
}
