'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Modal } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useTeamQuery } from '@/widgets/team-detail/model/hooks'
import { TeamCard } from '@/features/teams-list'
import { useLeaveTeamMutation } from '@/features/team-members'
import { useUnregisterFromHackathonMutation } from '../model/hooks'
import { useCan } from '@/shared/policy/useCan'
import type { components } from '@/shared/api/platform.schema'

type ParticipationStatus = components['schemas']['v1ParticipationStatus']

export interface MyParticipationTabContentProps {
  hackathonId: string
  myTeamId: string | null
  participationStatus: ParticipationStatus | null
  ctxLoading: boolean
}

export function MyParticipationTabContent({
  hackathonId,
  myTeamId,
  participationStatus,
  ctxLoading,
}: MyParticipationTabContentProps) {
  const t = useT()

  if (ctxLoading) {
    return (
      <div className="py-m8">
        <p className="typography-body-md text-text-secondary">{t('teams.list.loading')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-m16">
      {!myTeamId ? (
        <NoTeamContent hackathonId={hackathonId} participationStatus={participationStatus} />
      ) : (
        <ParticipationTeamCard hackathonId={hackathonId} teamId={myTeamId} />
      )}
      {/* Placeholder: submission block (send / view submission) will be added here later */}
    </div>
  )
}

function NoTeamContent({
  hackathonId,
  participationStatus,
}: {
  hackathonId: string
  participationStatus: ParticipationStatus | null
}) {
  const t = useT()
  const [unregisterConfirmOpen, setUnregisterConfirmOpen] = useState(false)
  const { decision: unregisterDecision } = useCan('Participation.Unregister', { hackathonId })
  const unregisterMutation = useUnregisterFromHackathonMutation(hackathonId)

  const statusText =
    participationStatus === 'PART_INDIVIDUAL'
      ? t('hackathons.detail.participation.solo')
      : participationStatus === 'PART_LOOKING_FOR_TEAM'
        ? t('hackathons.detail.participation.lookingForTeam')
        : t('hackathons.detail.participation.empty')

  const canUnregister = unregisterDecision.allowed

  const handleUnregisterConfirm = async () => {
    try {
      await unregisterMutation.mutateAsync()
      setUnregisterConfirmOpen(false)
    } catch (err) {
      console.error('Unregister failed:', err)
    }
  }

  return (
    <div className="flex flex-col gap-m8 py-m8">
      <p className="typography-body-md text-text-secondary">{statusText}</p>
      <p className="typography-body-sm text-text-tertiary">
        {t('hackathons.detail.participation.goToTeamsStub')}
      </p>
      {canUnregister && (
        <div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setUnregisterConfirmOpen(true)}
            disabled={unregisterMutation.isPending}
          >
            {t('hackathons.detail.participation.unregister')}
          </Button>
        </div>
      )}
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
  const queryClient = useQueryClient()
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false)
  const { data, isLoading } = useTeamQuery(hackathonId, teamId)
  const { decision: leaveDecision } = useCan('Team.LeaveTeam', { hackathonId, teamId })
  const leaveMutation = useLeaveTeamMutation(hackathonId, teamId)

  const canLeave = leaveDecision.allowed

  const handleLeaveConfirm = async () => {
    try {
      await leaveMutation.mutateAsync()
      queryClient.invalidateQueries({ queryKey: ['hackathon', 'participation', 'me', hackathonId] })
      setLeaveConfirmOpen(false)
    } catch (err) {
      console.error('Leave team failed:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="py-m8">
        <p className="typography-body-md text-text-secondary">{t('teams.list.loading')}</p>
      </div>
    )
  }

  const teamWithVacancies = data?.team
  if (!teamWithVacancies?.team) {
    return null
  }

  return (
    <div className="flex flex-col gap-m8 py-m8">
      <TeamCard
        hackathonId={hackathonId}
        teamWithVacancies={teamWithVacancies}
        variant="bordered"
      />
      {canLeave && (
        <div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setLeaveConfirmOpen(true)}
            disabled={leaveMutation.isPending}
          >
            {t('teams.actions.leave')}
          </Button>
        </div>
      )}
      <Modal
        open={leaveConfirmOpen}
        onClose={() => setLeaveConfirmOpen(false)}
        title={t('teams.actions.leave')}
      >
        <div className="flex flex-col gap-m6">
          <p className="typography-body-md text-text-primary">{t('teams.actions.leaveConfirm')}</p>
          <div className="flex gap-m4 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setLeaveConfirmOpen(false)}
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
    </div>
  )
}
