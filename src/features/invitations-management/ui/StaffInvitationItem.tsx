'use client'

import { useMemo, useState } from 'react'
import { ListItem, Button, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { batchGetUsers } from '@/entities/user/api/batchGetUsers'
import { useQuery } from '@tanstack/react-query'
import type { StaffInvitation, HackathonRole } from '@/entities/invitation'
import { InvitationMessageModal } from './InvitationMessageModal'
import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export interface StaffInvitationItemProps {
  invitation: StaffInvitation
  onAccept: () => void
  onReject: () => void
  isAccepting?: boolean
  isRejecting?: boolean
}

export function StaffInvitationItem({
  invitation,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}: StaffInvitationItemProps) {
  const t = useT()
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)

  const userIds = useMemo(() => {
    return [invitation.createdByUserId].filter((id): id is string => id != null)
  }, [invitation.createdByUserId])

  const { data: usersData } = useQuery({
    queryKey: ['users-batch', userIds],
    queryFn: async () => {
      const response = await batchGetUsers({ userIds })
      return {
        users: (response.users ?? [])
          .map(u => u.user)
          .filter((u): u is NonNullable<typeof u> => u != null),
      }
    },
    enabled: userIds.length > 0,
  })

  const createdByUser = usersData?.users.find(u => u.userId === invitation.createdByUserId)

  const { data: hackathonData } = useQuery({
    queryKey: ['hackathon', invitation.hackathonId],
    queryFn: async () => {
      if (!invitation.hackathonId) return null
      const response = await platformFetchJson<
        operations['HackathonService_GetHackathon']['responses']['200']['content']['application/json']
      >(`/v1/hackathons/${invitation.hackathonId}`, { method: 'GET' })
      return response.hackathon
    },
    enabled: !!invitation.hackathonId,
  })

  const getRoleLabel = (role?: HackathonRole) => {
    switch (role) {
      case 'HX_ROLE_OWNER':
        return t('hackathons.management.staff.roles.owner')
      case 'HX_ROLE_ORGANIZER':
        return t('hackathons.management.staff.roles.organizer')
      case 'HX_ROLE_MENTOR':
        return t('hackathons.management.staff.roles.mentor')
      case 'HX_ROLE_JUDGE':
        return t('hackathons.management.staff.roles.jury')
      default:
        return role ?? ''
    }
  }

  const isDisabled = isAccepting || isRejecting

  const getTitle = () => {
    const roleLabel = getRoleLabel(invitation.requestedRole)
    const hackathonName = hackathonData?.name || t('common.fallback.hackathon')
    return `${roleLabel} ${t('invitations.staff.on')} ${hackathonName}`
  }

  return (
    <>
      <ListItem
        variant="section"
        text={getTitle()}
        subtitle={
          createdByUser
            ? `${t('invitations.staff.invitedBy')} ${createdByUser.firstName} ${createdByUser.lastName}`
            : undefined
        }
        onClick={() => setIsMessageModalOpen(true)}
        rightContent={
          <div className="flex gap-m4 items-center">
            <Button
              variant="icon-secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onReject()
              }}
              disabled={isDisabled}
              aria-label={t('invitations.reject')}
            >
              <Icon src="/icons/icon-cross/icon-cross-sm.svg" size="sm" color="secondary" />
            </Button>
            <Button
              variant="icon-primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onAccept()
              }}
              disabled={isDisabled}
              aria-label={t('invitations.accept')}
            >
              <Icon src="/icons/icon-tick/icon-tick-sm.svg" size="sm" color="primary" />
            </Button>
          </div>
        }
      />

      <InvitationMessageModal
        open={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        message={invitation.message ?? ''}
        title={t('invitations.messageModal.title')}
        createdByUserId={invitation.createdByUserId}
        createdByUser={createdByUser}
        hackathonId={invitation.hackathonId}
      />
    </>
  )
}
