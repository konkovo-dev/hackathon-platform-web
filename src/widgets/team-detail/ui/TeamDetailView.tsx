'use client'

import { useState, useMemo } from 'react'
import { Breadcrumb, Section, Button, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { useTeamQuery, useHackathonQuery } from '../model/hooks'
import {
  TeamMembersList,
  useTeamMembersQuery,
  useTeamMemberUsersQuery,
  TransferCaptainModal,
  TeamInviteModal,
} from '@/features/team-members'
import { VacanciesList, VacancyUpsertModal } from '@/features/team-vacancies'
import { JoinRequestsList } from '@/features/join-requests-management'
import type { Vacancy } from '@/entities/team'
import { JoinTeamButton } from '@/features/team-join'
import { EditTeamModal } from '@/features/team-edit'
import { useCan } from '@/shared/policy/useCan'
import { AccessGate } from '@/shared/policy/AccessGate'
import { useMyParticipationQuery } from '@/entities/hackathon-context/model/hooks'

export interface TeamDetailViewProps {
  hackathonId: string
  teamId: string
  currentUserId: string | null | undefined
}

export function TeamDetailView({ hackathonId, teamId, currentUserId }: TeamDetailViewProps) {
  const t = useT()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [vacancyModalOpen, setVacancyModalOpen] = useState(false)
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)

  const isVacancyModalOpen = vacancyModalOpen || editingVacancy != null
  const closeVacancyModal = () => {
    setVacancyModalOpen(false)
    setEditingVacancy(null)
  }

  const { data: teamData, isLoading: isTeamLoading } = useTeamQuery(hackathonId, teamId)
  const { data: hackathon } = useHackathonQuery(hackathonId)
  const { data: myParticipation } = useMyParticipationQuery(hackathonId)
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
  const { decision: inviteDecision } = useCan('Team.InviteMember', { hackathonId, teamId })
  const { decision: manageJoinRequestsDecision } = useCan('Team.ManageJoinRequests', {
    hackathonId,
    teamId,
  })
  const { decision: leaveTeamDecision } = useCan('Team.LeaveTeam', { hackathonId, teamId })
  const { decision: canJoinTeamDecision } = useCan('Team.CanJoinTeam', { hackathonId })

  const canEdit = editDecision.allowed
  const canManageVacancy = manageVacancyDecision.allowed
  const canTransfer = transferDecision.allowed
  const canKickMember = kickDecision.allowed
  const canInviteMember = inviteDecision.allowed

  if (isTeamLoading) {
    return <p className="typography-body-sm text-text-secondary">{t('teams.list.loading')}</p>
  }

  if (!team) {
    return <p className="typography-body-sm text-text-secondary">{t('teams.errors.notFound')}</p>
  }

  const hackathonName = hackathon?.name ?? t('common.fallback.hackathon')
  const teamName = team.name ?? t('common.fallback.team')

  const myTeamIdFromParticipation = myParticipation?.teamId ?? null
  const participationStatus = myParticipation?.status ?? null
  const isParticipant =
    myTeamIdFromParticipation != null ||
    (participationStatus != null &&
      participationStatus !== 'PART_NONE' &&
      participationStatus !== 'PARTICIPATION_STATUS_UNSPECIFIED')

  const hackathonDetailHref = isParticipant
    ? routes.hackathons.detailWithTab(hackathonId, 'participation')
    : routes.hackathons.detail(hackathonId)

  const breadcrumbItems = [
    { label: t('hackathons.breadcrumb.hackathons'), href: routes.hackathons.list },
    { label: hackathonName, href: hackathonDetailHref },
    { label: teamName },
  ]

  return (
    <div className="flex flex-col gap-m16">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col gap-m6">
        <Section
          title={t('hackathons.detail.info.title')}
          variant="elevated"
          hoverAction={
            canEdit ? (
              <Button
                variant="icon-secondary"
                size="xs"
                onClick={() => setEditModalOpen(true)}
                aria-label={t('teams.actions.edit')}
              >
                <Icon src="/icons/icon-edit/icon-edit-xs.svg" size="xs" color="secondary" />
              </Button>
            ) : undefined
          }
        >
          <div className="flex flex-col gap-m6">
            <h2 className="typography-body-lg-medium text-text-primary">{team.name}</h2>
            {team.description ? (
              <p className="typography-body-md-regular text-text-secondary">{team.description}</p>
            ) : (
              <p className="typography-body-md-regular text-text-tertiary">
                {t('hackathons.detail.no_description')}
              </p>
            )}
            <div className="flex items-center gap-m4 flex-wrap pt-m4">
              <AccessGate decision={canJoinTeamDecision}>
                <JoinTeamButton hackathonId={hackathonId} teamId={teamId} vacancies={vacancies} />
              </AccessGate>
            </div>
          </div>
        </Section>

        <TeamMembersList
          hackathonId={hackathonId}
          teamId={teamId}
          currentUserId={currentUserId}
          canKickMember={canKickMember}
          canLeaveTeam={leaveTeamDecision.allowed}
          canInviteMember={canInviteMember}
          onInvite={() => setInviteModalOpen(true)}
          onTransferCaptain={canTransfer ? () => setTransferModalOpen(true) : undefined}
        />

        <VacanciesList
          vacancies={vacancies}
          hackathonId={hackathonId}
          teamId={teamId}
          canManage={canManageVacancy}
          onAdd={() => {
            setEditingVacancy(null)
            setVacancyModalOpen(true)
          }}
          onEdit={v => {
            setEditingVacancy(v)
          }}
        />

        <AccessGate decision={manageJoinRequestsDecision}>
          <JoinRequestsList hackathonId={hackathonId} teamId={teamId} vacancies={vacancies} />
        </AccessGate>
      </div>
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

      <VacancyUpsertModal
        open={isVacancyModalOpen}
        onClose={closeVacancyModal}
        hackathonId={hackathonId}
        teamId={teamId}
        vacancy={editingVacancy ?? undefined}
      />

      <TeamInviteModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        hackathonId={hackathonId}
        teamId={teamId}
        vacancies={vacancies}
      />
    </div>
  )
}
