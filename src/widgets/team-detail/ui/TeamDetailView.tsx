'use client'

import { useState, useMemo } from 'react'
import { Section, Button } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useTeamQuery } from '../model/hooks'
import {
  TeamMembersList,
  useTeamMembersQuery,
  useTeamMemberUsersQuery,
  TransferCaptainModal,
} from '@/features/team-members'
import { VacanciesList } from '@/features/team-vacancies'
import { JoinTeamButton } from '@/features/team-join'
import { EditTeamModal } from '@/features/team-edit'
import { useCan } from '@/shared/policy/useCan'
import { AccessGate } from '@/shared/policy/AccessGate'

export interface TeamDetailViewProps {
  hackathonId: string
  teamId: string
  currentUserId: string | null | undefined
}

export function TeamDetailView({ hackathonId, teamId, currentUserId }: TeamDetailViewProps) {
  const t = useT()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)

  const { data: teamData, isLoading: isTeamLoading } = useTeamQuery(hackathonId, teamId)
  const { data: membersData } = useTeamMembersQuery(hackathonId, teamId)
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

  const team = teamData?.team?.team
  const vacancies = teamData?.team?.vacancies || []

  const { decision: editDecision } = useCan('Team.EditTeam', { hackathonId, teamId })
  const { decision: manageVacancyDecision } = useCan('Team.ManageVacancies', {
    hackathonId,
    teamId,
  })
  const { decision: transferDecision } = useCan('Team.TransferCaptain', { hackathonId, teamId })
  const { decision: kickDecision } = useCan('Team.KickMember', { hackathonId, teamId })
  const { decision: canJoinTeamDecision } = useCan('Team.CanJoinTeam', { hackathonId })

  const canEdit = editDecision.allowed
  const canManageVacancy = manageVacancyDecision.allowed
  const canTransfer = transferDecision.allowed
  const canKickMember = kickDecision.allowed

  if (isTeamLoading) {
    return <p className="typography-body-sm text-text-secondary">{t('teams.list.loading')}</p>
  }

  if (!team) {
    return <p className="typography-body-sm text-text-secondary">{t('teams.errors.notFound')}</p>
  }

  return (
    <div className="flex flex-col gap-m8">
      <div className="flex items-center justify-between gap-m4 flex-wrap">
        <h1 className="typography-title-lg text-text-primary">{team.name}</h1>
        <div className="flex items-center gap-m4">
          {canEdit && (
            <Button variant="secondary" size="md" onClick={() => setEditModalOpen(true)}>
              {t('teams.actions.edit')}
            </Button>
          )}
          <AccessGate decision={canJoinTeamDecision}>
            <JoinTeamButton hackathonId={hackathonId} teamId={teamId} vacancies={vacancies} />
          </AccessGate>
        </div>
      </div>

      <Section title={t('teams.detail.info')} variant="elevated">
        <div className="flex flex-col gap-m4">
          {team.description ? (
            <p className="typography-body-md text-text-secondary">{team.description}</p>
          ) : (
            <p className="typography-body-md text-text-tertiary">{t('hackathons.detail.no_description')}</p>
          )}
        </div>
      </Section>

      <TeamMembersList
        hackathonId={hackathonId}
        teamId={teamId}
        currentUserId={currentUserId}
        canKickMember={canKickMember}
        onTransferCaptain={canTransfer ? () => setTransferModalOpen(true) : undefined}
      />

      <VacanciesList vacancies={vacancies} canManage={canManageVacancy} />

      {team && (
        <EditTeamModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          hackathonId={hackathonId}
          team={team}
        />
      )}

      <TransferCaptainModal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        hackathonId={hackathonId}
        teamId={teamId}
        members={members}
        usersMap={usersMap}
        currentUserId={currentUserId}
      />
    </div>
  )
}
