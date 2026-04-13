'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { SelectList, Section, Button, Modal, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { ApiError } from '@/shared/api/errors'
import { UserListItem } from '@/entities/user'
import {
  useTeamMembersQuery,
  useTeamMemberUsersQuery,
  useKickMemberMutation,
  useLeaveTeamMutation,
} from '../model/hooks'

export interface TeamMembersListProps {
  hackathonId: string
  teamId: string
  currentUserId: string | null | undefined
  canKickMember: boolean
  canLeaveTeam?: boolean
  canInviteMember?: boolean
  onInvite?: () => void
  onTransferCaptain?: () => void
}

export function TeamMembersList({
  hackathonId,
  teamId,
  currentUserId,
  canKickMember: canKickFromApi,
  canLeaveTeam = false,
  canInviteMember,
  onInvite,
  onTransferCaptain,
}: TeamMembersListProps) {
  const t = useT()
  const router = useRouter()
  const [confirmKickUserId, setConfirmKickUserId] = useState<string | null>(null)
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false)
  const [leaveError, setLeaveError] = useState<string | null>(null)

  const { data: membersData, isLoading } = useTeamMembersQuery(hackathonId, teamId)
  const members = useMemo(() => membersData?.members || [], [membersData])

  const userIds = useMemo(
    () => members.map(m => m.userId).filter((id): id is string => id != null),
    [members]
  )

  const { data: usersData } = useTeamMemberUsersQuery(userIds)
  const usersMap = useMemo(() => {
    if (!usersData?.users) return new Map()
    return new Map(usersData.users.map(u => [u.userId, u]))
  }, [usersData])

  const kickMutation = useKickMemberMutation(hackathonId, teamId)
  const leaveMutation = useLeaveTeamMutation(hackathonId, teamId)

  const myMembership = useMemo(() => {
    if (!currentUserId) return null
    return members.find(m => m.userId === currentUserId) ?? null
  }, [members, currentUserId])

  const showLeave = Boolean(canLeaveTeam && myMembership && !myMembership.isCaptain)

  const handleLeaveConfirm = async () => {
    try {
      setLeaveError(null)
      await leaveMutation.mutateAsync()
      setConfirmLeaveOpen(false)
      router.replace(routes.hackathons.detailWithTab(hackathonId, 'participation'))
    } catch (error) {
      console.error('Failed to leave team:', error)
      if (error instanceof ApiError) {
        setLeaveError(error.data.message || t('teams.errors.leaveFailed'))
      } else {
        setLeaveError(t('teams.errors.leaveFailed'))
      }
    }
  }

  const handleKickConfirm = async () => {
    if (!confirmKickUserId) return
    try {
      await kickMutation.mutateAsync(confirmKickUserId)
      setConfirmKickUserId(null)
    } catch (error) {
      console.error('Failed to kick member:', error)
    }
  }

  if (isLoading) {
    return <p className="typography-body-sm text-text-secondary">{t('teams.list.loading')}</p>
  }

  return (
    <>
      <Section
        title={t('teams.members.title')}
        variant="elevated"
        action={
          canInviteMember && onInvite ? (
            <Button
              variant="icon-secondary"
              size="xs"
              onClick={onInvite}
              aria-label={t('teams.invitations.create')}
            >
              <Icon src="/icons/icon-plus/icon-plus-xs.svg" size="xs" color="secondary" />
            </Button>
          ) : undefined
        }
      >
        {members.length === 0 ? (
          <p className="typography-body-sm text-text-secondary">{t('teams.members.empty')}</p>
        ) : (
          <SelectList>
            {members.map(member => {
              if (!member.userId) return null

              const user = usersMap.get(member.userId)
              const isCaptain = member.isCaptain
              const canKick = canKickFromApi && !isCaptain && member.userId !== currentUserId

              return (
                <UserListItem
                  key={member.userId}
                  userId={member.userId}
                  user={user}
                  caption={isCaptain ? t('teams.members.captain') : t('teams.members.member')}
                  variant="bordered"
                  showNavigationIcon
                  rightContent={
                    canKick ? (
                      <Button
                        variant="icon-secondary"
                        size="sm"
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          setConfirmKickUserId(member.userId!)
                        }}
                        aria-label={t('teams.members.kick')}
                      >
                        <Icon
                          src="/icons/icon-cross/icon-cross-sm.svg"
                          size="sm"
                          color="secondary"
                        />
                      </Button>
                    ) : undefined
                  }
                />
              )
            })}
          </SelectList>
        )}

        {((onTransferCaptain && members.length > 1) || showLeave) && (
          <div className="flex flex-wrap gap-m4 justify-end">
            {onTransferCaptain && members.length > 1 && (
              <Button variant="secondary" size="md" onClick={onTransferCaptain}>
                {t('teams.members.transferCaptain')}
              </Button>
            )}
            {showLeave && (
              <Button variant="secondary" size="md" onClick={() => setConfirmLeaveOpen(true)}>
                {t('teams.actions.leave')}
              </Button>
            )}
          </div>
        )}
      </Section>

      <Modal
        open={confirmLeaveOpen}
        onClose={() => {
          setConfirmLeaveOpen(false)
          setLeaveError(null)
        }}
        title={t('teams.actions.leave')}
      >
        <div className="flex flex-col gap-m6">
          <p className="typography-body-md text-text-primary">{t('teams.actions.leaveConfirm')}</p>
          {leaveError && (
            <p className="typography-body-sm text-state-error" role="alert">
              {leaveError}
            </p>
          )}
          <div className="flex gap-m4 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setConfirmLeaveOpen(false)
                setLeaveError(null)
              }}
              disabled={leaveMutation.isPending}
            >
              {t('teams.create.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleLeaveConfirm}
              disabled={leaveMutation.isPending}
            >
              {leaveMutation.isPending ? t('teams.list.loading') : t('teams.actions.leave')}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!confirmKickUserId}
        onClose={() => setConfirmKickUserId(null)}
        title={t('teams.members.kick')}
      >
        <div className="flex flex-col gap-m6">
          <p className="typography-body-md text-text-primary">{t('teams.members.kickConfirm')}</p>

          <div className="flex gap-m4 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setConfirmKickUserId(null)}
              disabled={kickMutation.isPending}
            >
              {t('teams.create.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleKickConfirm}
              disabled={kickMutation.isPending}
            >
              {kickMutation.isPending ? t('teams.list.loading') : t('teams.members.kick')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
