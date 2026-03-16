'use client'

import { Modal, MarkdownContent, Icon, Section } from '@/shared/ui'
import { UserListItem } from '@/entities/user'
import { HackathonCompactCard } from '@/entities/hackathon'
import { useT } from '@/shared/i18n/useT'
import { useRouter } from 'next/navigation'
import { routes } from '@/shared/config/routes'
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
}

export function InvitationMessageModal({
  open,
  onClose,
  message,
  title,
  createdByUserId,
  createdByUser,
  hackathonId,
}: InvitationMessageModalProps) {
  const t = useT()
  const router = useRouter()

  const { data: hackathonData } = useQuery({
    queryKey: ['hackathon', hackathonId],
    queryFn: async () => {
      if (!hackathonId) return null
      const response = await platformFetchJson<
        operations['HackathonService_GetHackathon']['responses']['200']['content']['application/json']
      >(`/v1/hackathons/${hackathonId}`, { method: 'GET' })
      return response.hackathon
    },
    enabled: !!hackathonId,
  })

  const handleGoToProfile = () => {
    if (createdByUserId) {
      router.push(routes.user(createdByUserId))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title || t('invitations.messageModal.title')} size="md">
      <div className="flex flex-col gap-m8">
        <div className="grid grid-cols-2 gap-m4">
          {createdByUserId && (
            <UserListItem
              userId={createdByUserId}
              user={createdByUser}
              variant="bordered"
              onClick={handleGoToProfile}
              rightContent={
                <Icon src="/icons/icon-arrow/icon-arrow-right-md.svg" size="md" color="secondary" />
              }
            />
          )}

          {hackathonId && (
            <HackathonCompactCard
              hackathon={hackathonData as any}
              hackathonId={hackathonId}
              variant="bordered"
            />
          )}
        </div>

        <Section title={t('invitations.messageModal.message')} variant="outlined">
          <MarkdownContent>{message}</MarkdownContent>
        </Section>
      </div>
    </Modal>
  )
}
