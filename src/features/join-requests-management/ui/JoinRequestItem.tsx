'use client'

import { useMemo, useState } from 'react'
import { ListItem, Button, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useQuery } from '@tanstack/react-query'
import { batchGetUsers } from '@/entities/user/api/batchGetUsers'
import { listTeamRoles, type JoinRequest, type Vacancy } from '@/entities/team'
import { InvitationMessageModal } from '@/features/invitations-management/ui/InvitationMessageModal'

export interface JoinRequestItemProps {
  request: JoinRequest
  vacancies: Vacancy[]
  onAccept: () => void
  onReject: () => void
  isAccepting?: boolean
  isRejecting?: boolean
}

export function JoinRequestItem({
  request,
  vacancies,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}: JoinRequestItemProps) {
  const t = useT()
  const [messageOpen, setMessageOpen] = useState(false)

  const { data: rolesData } = useQuery({
    queryKey: ['team-roles'],
    queryFn: listTeamRoles,
  })

  const rolesById = useMemo(
    () =>
      new Map(
        (rolesData?.teamRoles ?? [])
          .filter((r): r is { id: string; name: string } => Boolean(r?.id && r?.name))
          .map(r => [r.id, r.name] as const)
      ),
    [rolesData?.teamRoles]
  )

  const subtitle = useMemo(() => {
    const vacancyId = request.vacancyId
    if (!vacancyId) {
      return `${t('teams.joinRequests.roles')}: ${t('teams.joinRequests.vacancyUnknown')}`
    }
    const v = vacancies.find(x => x.vacancyId === vacancyId)
    if (!v) {
      return `${t('teams.joinRequests.roles')}: ${vacancyId}`
    }
    const slotsOpen = parseInt(v.slotsOpen ?? '0', 10)
    const slotsTotal = parseInt(v.slotsTotal ?? '0', 10)
    const slotsText = t('teams.vacancies.slots', { open: slotsOpen, total: slotsTotal })
    const roleLabels = (v.desiredRoleIds ?? [])
      .map(id => rolesById.get(id))
      .filter((label): label is string => Boolean(label))
    const display = roleLabels.length > 0 ? roleLabels.join(', ') : slotsText
    return `${t('teams.joinRequests.roles')}: ${display}`
  }, [request.vacancyId, vacancies, rolesById, t])

  const userIds = useMemo(
    () => [request.requesterUserId].filter((id): id is string => id != null),
    [request.requesterUserId]
  )

  const { data: usersData } = useQuery({
    queryKey: ['users-batch', userIds],
    queryFn: async () => {
      const response = await batchGetUsers({ userIds, includeSkills: true })
      return {
        users: (response.users ?? [])
          .map(u => u.user)
          .filter((u): u is NonNullable<typeof u> => u != null),
      }
    },
    enabled: userIds.length > 0,
  })

  const requesterUser = usersData?.users.find(u => u.userId === request.requesterUserId)
  const requesterName = requesterUser
    ? [requesterUser.firstName, requesterUser.lastName].filter(Boolean).join(' ').trim()
    : request.requesterUserId

  const isDisabled = isAccepting || isRejecting

  return (
    <>
      <ListItem
        variant="bordered"
        text={requesterName ?? '—'}
        subtitle={subtitle}
        onClick={request.message ? () => setMessageOpen(true) : undefined}
        rightContent={
          <div className="flex gap-m4 items-center">
            <Button
              variant="icon-secondary"
              size="sm"
              onClick={e => {
                e.stopPropagation()
                onReject()
              }}
              disabled={isDisabled}
              aria-label={t('teams.joinRequests.reject')}
            >
              <Icon src="/icons/icon-cross/icon-cross-sm.svg" size="sm" color="secondary" />
            </Button>
            <Button
              variant="icon-primary"
              size="sm"
              onClick={e => {
                e.stopPropagation()
                onAccept()
              }}
              disabled={isDisabled}
              aria-label={t('teams.joinRequests.accept')}
            >
              <Icon src="/icons/icon-tick/icon-tick-sm.svg" size="sm" color="primary" />
            </Button>
          </div>
        }
      />

      {request.message && (
        <InvitationMessageModal
          open={messageOpen}
          onClose={() => setMessageOpen(false)}
          message={request.message}
          title={t('teams.joinRequests.viewMessage')}
          createdByUserId={request.requesterUserId}
          createdByUser={requesterUser}
          showHackathon={false}
        />
      )}
    </>
  )
}
