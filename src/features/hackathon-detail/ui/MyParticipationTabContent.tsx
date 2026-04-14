'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Button, Chip, Divider, Icon, ListItem, Modal, Section } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { useTeamQuery } from '@/entities/team/model/hooks'
import { listTeamMembers } from '@/entities/team'
import { useMyParticipationQuery } from '@/entities/hackathon-context/model/hooks'
import { useSwitchParticipationModeMutation } from '@/features/hackathon-registration/model/hooks'
import { EditParticipationApplicationModal } from './EditParticipationApplicationModal'
import { useUnregisterFromHackathonMutation } from '../model/hooks'
import { useSessionQuery } from '@/features/auth/model/hooks'
import { useCan } from '@/shared/policy/useCan'
import { MatchmakingTeamsList } from '@/features/matchmaking-teams'
import { SubmissionBlock } from '@/features/submission'
import type { OwnerKind } from '@/entities/submission'
import type { HackathonStage } from '@/entities/hackathon-context/model/types'
import { listTeamRoles } from '@/entities/team'

export interface MyParticipationTabContentProps {
  hackathonId: string
  myTeamId: string | null
  ctxLoading: boolean
  hackathonStage: HackathonStage
  registrationPolicy?: { allowIndividual?: boolean; allowTeam?: boolean }
}

export function MyParticipationTabContent({
  hackathonId,
  myTeamId,
  ctxLoading,
  hackathonStage,
  registrationPolicy,
}: MyParticipationTabContentProps) {
  const t = useT()
  const { data: session, isLoading: sessionLoading } = useSessionQuery()
  const sessionUserId =
    session && session.active === true && 'userId' in session ? session.userId : null
  const submissionOwnerKind: OwnerKind = myTeamId ? 'team' : 'user'
  const submissionOwnerId = myTeamId ?? sessionUserId
  const submissionOwnerPending = !myTeamId && sessionLoading

  if (ctxLoading) {
    return (
      <div className="py-m8">
        <p className="typography-body-md text-text-secondary">{t('teams.list.loading')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-m8">
      {!myTeamId ? (
        <NoTeamContent
          hackathonId={hackathonId}
          hackathonStage={hackathonStage}
          allowTeam={registrationPolicy?.allowTeam ?? true}
        />
      ) : (
        <ParticipationTeamCard hackathonId={hackathonId} teamId={myTeamId} />
      )}
      {(hackathonStage === 'RUNNING' ||
        hackathonStage === 'JUDGING' ||
        hackathonStage === 'FINISHED') && (
        <SubmissionBlock
          hackathonId={hackathonId}
          hackathonStage={hackathonStage}
          submissionOwnerKind={submissionOwnerKind}
          submissionOwnerId={submissionOwnerId}
          submissionOwnerPending={submissionOwnerPending}
        />
      )}
    </div>
  )
}

function NoTeamContent({
  hackathonId,
  hackathonStage,
  allowTeam,
}: {
  hackathonId: string
  hackathonStage: HackathonStage
  allowTeam: boolean
}) {
  const t = useT()
  const [unregisterConfirmOpen, setUnregisterConfirmOpen] = useState(false)
  const [editApplicationOpen, setEditApplicationOpen] = useState(false)

  const participationQuery = useMyParticipationQuery(hackathonId)
  const participationStatus = participationQuery.data?.status ?? null
  const participationData = participationQuery.data

  const { decision: unregisterDecision } = useCan('Participation.Unregister', { hackathonId })
  const { decision: switchModeDecision } = useCan('Participation.SwitchParticipationMode', {
    hackathonId,
  })
  const { decision: updateProfileDecision } = useCan('Participation.UpdateParticipationProfile', {
    hackathonId,
  })

  const canEditApplication =
    updateProfileDecision.allowed &&
    hackathonStage === 'REGISTRATION' &&
    (participationStatus === 'PART_INDIVIDUAL' || participationStatus === 'PART_LOOKING_FOR_TEAM')

  const { data: teamRolesData } = useQuery({
    queryKey: ['team-roles'],
    queryFn: listTeamRoles,
    enabled:
      allowTeam &&
      participationStatus === 'PART_LOOKING_FOR_TEAM' &&
      hackathonStage === 'REGISTRATION' &&
      canEditApplication,
  })
  const teamRoleOptions = useMemo(
    () =>
      (teamRolesData?.teamRoles ?? []).filter((r): r is { id: string; name: string } =>
        Boolean(r.id && r.name)
      ),
    [teamRolesData?.teamRoles]
  )

  const unregisterMutation = useUnregisterFromHackathonMutation(hackathonId)
  const switchModeMutation = useSwitchParticipationModeMutation(hackathonId)

  const statusText =
    participationStatus === 'PART_INDIVIDUAL'
      ? t('hackathons.detail.participation.solo')
      : participationStatus === 'PART_LOOKING_FOR_TEAM'
        ? t('hackathons.detail.participation.lookingForTeam')
        : t('hackathons.detail.participation.empty')

  const canUnregister = unregisterDecision.allowed
  const canSwitchMode = switchModeDecision.allowed
  const hasVisibleActions =
    (canSwitchMode && participationStatus === 'PART_INDIVIDUAL') ||
    (canSwitchMode && participationStatus === 'PART_LOOKING_FOR_TEAM') ||
    canUnregister

  const motivationBriefRaw = participationData?.motivationText?.trim() ?? ''
  const motivationBrief =
    motivationBriefRaw.length > 220 ? `${motivationBriefRaw.slice(0, 220)}…` : motivationBriefRaw

  const handleSwitchToLookingForTeam = async () => {
    try {
      await switchModeMutation.mutateAsync({ newStatus: 'PART_LOOKING_FOR_TEAM' })
    } catch (err) {
      console.error('Switch participation mode failed:', err)
    }
  }

  const handleSwitchToIndividual = async () => {
    try {
      await switchModeMutation.mutateAsync({ newStatus: 'PART_INDIVIDUAL' })
    } catch (err) {
      console.error('Switch participation mode failed:', err)
    }
  }

  const handleUnregisterConfirm = async () => {
    try {
      await unregisterMutation.mutateAsync()
      setUnregisterConfirmOpen(false)
    } catch (err) {
      console.error('Unregister failed:', err)
    }
  }

  return (
    <div className="flex flex-col gap-m8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-m8 items-stretch">
        <Section
          title={t('hackathons.detail.participation.sectionParticipationInfo')}
          variant="elevated"
          className="min-w-0"
          hoverAction={
            canEditApplication ? (
              <Button
                variant="icon-secondary"
                size="xs"
                onClick={() => setEditApplicationOpen(true)}
                aria-label={t('hackathons.detail.participation.editApplication')}
              >
                <Icon src="/icons/icon-edit/icon-edit-xs.svg" size="xs" color="secondary" />
              </Button>
            ) : undefined
          }
        >
          <div className="flex flex-col gap-m8">
            <p className="typography-body-md text-text-secondary">{statusText}</p>
            {canEditApplication && (
              <>
                <Divider />
                <div className="flex flex-col gap-m6">
                  <div className="flex flex-col gap-m6">
                    <span className="typography-label-md text-text-primary">
                      {t('hackathons.detail.registrationForm.motivationLabel')}
                    </span>
                    <p className="typography-body-md text-text-primary whitespace-pre-wrap line-clamp-4">
                      {motivationBrief ||
                        t('hackathons.detail.participation.applicationMotivationEmpty')}
                    </p>
                  </div>
                  {participationStatus === 'PART_LOOKING_FOR_TEAM' &&
                    allowTeam &&
                    (participationData?.wishedRoleIds?.length ?? 0) > 0 && (
                      <div className="flex flex-col gap-m6">
                        <span className="typography-label-md text-text-primary">
                          {t('hackathons.detail.registrationForm.wishedRolesLabel')}
                        </span>
                        <div className="flex flex-wrap gap-m2">
                          {(participationData?.wishedRoleIds ?? []).map(roleId => {
                            const name = teamRoleOptions.find(r => r.id === roleId)?.name
                            if (!name) return null
                            return <Chip key={roleId} label={name} variant="secondary" />
                          })}
                        </div>
                      </div>
                    )}
                </div>
              </>
            )}
          </div>
        </Section>

        <Section
          title={t('hackathons.detail.participation.sectionActions')}
          variant="elevated"
          className="min-w-0"
        >
          {hasVisibleActions ? (
            <div className="flex flex-col gap-m4">
              {canSwitchMode && participationStatus === 'PART_INDIVIDUAL' && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleSwitchToLookingForTeam}
                  disabled={switchModeMutation.isPending}
                >
                  {t('hackathons.detail.participation.switchToLookingForTeam')}
                </Button>
              )}
              {canSwitchMode && participationStatus === 'PART_LOOKING_FOR_TEAM' && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleSwitchToIndividual}
                  disabled={switchModeMutation.isPending}
                >
                  {t('hackathons.detail.participation.switchToIndividual')}
                </Button>
              )}
              {canUnregister && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setUnregisterConfirmOpen(true)}
                  disabled={unregisterMutation.isPending}
                >
                  {t('hackathons.detail.participation.unregister')}
                </Button>
              )}
            </div>
          ) : (
            <p className="typography-body-sm text-text-tertiary">
              {t('hackathons.detail.participation.actionsEmpty')}
            </p>
          )}
        </Section>
      </div>

      <MatchmakingTeamsList
        hackathonId={hackathonId}
        fetchEnabled={
          participationStatus === 'PART_LOOKING_FOR_TEAM' && hackathonStage === 'REGISTRATION'
        }
      />

      <EditParticipationApplicationModal
        open={editApplicationOpen}
        onClose={() => setEditApplicationOpen(false)}
        hackathonId={hackathonId}
        allowTeam={allowTeam}
        participationStatus={participationStatus}
      />

      <Modal
        open={unregisterConfirmOpen}
        onClose={() => setUnregisterConfirmOpen(false)}
        title={t('hackathons.detail.participation.unregister')}
      >
        <div className="flex flex-col gap-m6">
          <p className="typography-body-md text-text-primary">
            {t('hackathons.detail.participation.unregisterConfirm')}
          </p>
          <div className="flex gap-m4 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setUnregisterConfirmOpen(false)}
              disabled={unregisterMutation.isPending}
            >
              {t('teams.create.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleUnregisterConfirm}
              disabled={unregisterMutation.isPending}
            >
              {unregisterMutation.isPending
                ? t('teams.list.loading')
                : t('hackathons.detail.participation.unregister')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function ParticipationTeamCard({ hackathonId, teamId }: { hackathonId: string; teamId: string }) {
  const t = useT()
  const router = useRouter()
  const { data, isLoading } = useTeamQuery(hackathonId, teamId)

  const team = data?.team?.team
  const tid = team?.teamId ?? teamId

  const { data: membersData } = useQuery({
    queryKey: ['team-members', hackathonId, tid],
    queryFn: () => listTeamMembers(hackathonId, tid),
    enabled: Boolean(team && hackathonId && tid),
  })

  const memberCount = membersData?.members?.length ?? 0
  const membersLabel =
    memberCount === 1
      ? t('teams.card.member', { count: 1 })
      : t('teams.card.members', { count: memberCount })

  const goToTeam = () => {
    if (tid) router.push(routes.hackathons.teams.detail(hackathonId, tid))
  }

  if (isLoading) {
    return (
      <div className="py-m8">
        <p className="typography-body-md text-text-secondary">{t('teams.list.loading')}</p>
      </div>
    )
  }

  if (!team) {
    return null
  }

  const teamName = team.name?.trim() || tid || '—'

  return (
    <Section title={t('hackathons.detail.tabs.myTeam')} variant="elevated" className="min-w-0">
      <ListItem
        variant="bordered"
        text={teamName}
        subtitle={membersLabel}
        onClick={goToTeam}
        rightContent={
          <Icon src="/icons/icon-arrow/icon-arrow-right-md.svg" size="md" color="secondary" />
        }
      />
    </Section>
  )
}
