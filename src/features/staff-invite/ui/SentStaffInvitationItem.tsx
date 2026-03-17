'use client'

import { useMemo } from 'react'
import { ListItem, Button, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { batchGetUsers } from '@/entities/user/api/batchGetUsers'
import { useQuery } from '@tanstack/react-query'
import type { StaffInvitation, HackathonRole } from '@/entities/invitation'

export interface SentStaffInvitationItemProps {
  invitation: StaffInvitation
  onCancel: () => void
  isCancelling?: boolean
}

function getRoleLabel(role: HackathonRole | undefined, t: ReturnType<typeof useT>) {
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

export function SentStaffInvitationItem({
  invitation,
  onCancel,
  isCancelling,
}: SentStaffInvitationItemProps) {
  const t = useT()
  const userIds = useMemo(
    () => [invitation.targetUserId].filter((id): id is string => id != null),
    [invitation.targetUserId]
  )

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

  const targetUser = usersData?.users.find(u => u.userId === invitation.targetUserId)
  const title = targetUser
    ? `${targetUser.firstName ?? ''} ${targetUser.lastName ?? ''}`.trim() ||
      t('common.fallback.unknown')
    : t('common.fallback.unknown')
  const roleLabel = getRoleLabel(invitation.requestedRole, t)

  return (
    <ListItem
      variant="bordered"
      text={title}
      subtitle={roleLabel}
      rightContent={
        <Button
          variant="icon-secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onCancel()
          }}
          disabled={isCancelling}
          aria-label={t('invitations.cancel')}
        >
          <Icon src="/icons/icon-cross/icon-cross-sm.svg" size="sm" color="secondary" />
        </Button>
      }
    />
  )
}
