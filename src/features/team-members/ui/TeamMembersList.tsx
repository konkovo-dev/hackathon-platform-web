'use client'

import { useState, useMemo } from 'react'
import { SelectList, Section, Button, Modal } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { UserListItem } from '@/entities/user'
import { useTeamMembersQuery, useTeamMemberUsersQuery, useKickMemberMutation } from '../model/hooks'

export interface TeamMembersListProps {
  hackathonId: string
  teamId: string
  currentUserId: string | null | undefined
  canKickMember: boolean
  onTransferCaptain?: () => void
}

export function TeamMembersList({
  hackathonId,
  teamId,
  currentUserId,
  canKickMember: canKickFromApi,
  onTransferCaptain,
}: TeamMembersListProps) {
  const t = useT()
  const [confirmKickUserId, setConfirmKickUserId] = useState<string | null>(null)

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

  if (members.length === 0) {
    return <p className="typography-body-sm text-text-secondary">{t('teams.members.empty')}</p>
  }

  return (
    <>
      <Section title={t('teams.members.title')} variant="outlined">
        <SelectList>
          {members.map(member => {
            if (!member.userId) return null

            const user = usersMap.get(member.userId)
            const isCaptain = member.isCaptain
            const canKick =
              canKickFromApi &&
              !isCaptain &&
              member.userId !== currentUserId

            return (
              <UserListItem
                key={member.userId}
                userId={member.userId}
                user={user}
                caption={isCaptain ? t('teams.members.captain') : t('teams.members.member')}
                variant="bordered"
                badge={isCaptain ? t('teams.members.captain') : undefined}
                rightContent={
                  canKick ? (
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={e => {
                        e.stopPropagation()
                        setConfirmKickUserId(member.userId!)
                      }}
                    >
                      {t('teams.members.kick')}
                    </Button>
                  ) : undefined
                }
              />
            )
          })}
        </SelectList>

        {onTransferCaptain && members.length > 1 && (
          <div className="mt-m6 flex justify-end">
            <Button variant="secondary" size="md" onClick={onTransferCaptain}>
              {t('teams.members.transferCaptain')}
            </Button>
          </div>
        )}
      </Section>

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
