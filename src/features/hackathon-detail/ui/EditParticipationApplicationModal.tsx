'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, ErrorAlert, Modal } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useMyParticipationQuery } from '@/entities/hackathon-context/model/hooks'
import { ParticipationProfileFields } from '@/features/hackathon-registration/ui/ParticipationProfileFields'
import { useUpdateMyParticipationMutation } from '@/features/hackathon-registration/model/hooks'
import { listTeamRoles } from '@/entities/team'
import { ApiError } from '@/shared/api/errors'
import { getHackathonRegistrationErrorI18nKey } from '@/shared/lib/api/hackathonRegistrationErrorKey'
import type { components } from '@/shared/api/platform.schema'

type ParticipationStatus = components['schemas']['v1ParticipationStatus']

export interface EditParticipationApplicationModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  allowTeam: boolean
  participationStatus: ParticipationStatus | null
}

export function EditParticipationApplicationModal({
  open,
  onClose,
  hackathonId,
  allowTeam,
  participationStatus,
}: EditParticipationApplicationModalProps) {
  const t = useT()
  const [applicationError, setApplicationError] = useState<string | null>(null)
  const [motivation, setMotivation] = useState('')
  const [wishedIds, setWishedIds] = useState<string[]>([])

  const participationQuery = useMyParticipationQuery(hackathonId)

  const { data: teamRolesData } = useQuery({
    queryKey: ['team-roles'],
    queryFn: listTeamRoles,
    enabled: open && allowTeam && participationStatus === 'PART_LOOKING_FOR_TEAM',
  })
  const teamRoleOptions = useMemo(
    () =>
      (teamRolesData?.teamRoles ?? []).filter((r): r is { id: string; name: string } =>
        Boolean(r.id && r.name)
      ),
    [teamRolesData?.teamRoles]
  )

  const showRolesInApplication =
    participationStatus === 'PART_LOOKING_FOR_TEAM' && allowTeam && teamRoleOptions.length > 0

  const updateApplicationMutation = useUpdateMyParticipationMutation(hackathonId)

  useEffect(() => {
    if (!open) return
    const d = participationQuery.data
    if (!d) return
    setApplicationError(null)
    setMotivation(d.motivationText ?? '')
    setWishedIds([...(d.wishedRoleIds ?? [])])
  }, [open, participationQuery.data])

  const handleSave = async () => {
    try {
      setApplicationError(null)
      if (participationStatus === 'PART_LOOKING_FOR_TEAM' && allowTeam) {
        await updateApplicationMutation.mutateAsync({
          motivationText: motivation.trim() || undefined,
          wishedRoleIds: wishedIds,
        })
      } else {
        await updateApplicationMutation.mutateAsync({
          motivationText: motivation.trim() || undefined,
        })
      }
      onClose()
    } catch (e) {
      if (e instanceof ApiError) {
        setApplicationError(t(getHackathonRegistrationErrorI18nKey(e.data)))
      } else {
        setApplicationError(t('hackathons.detail.errors.register_failed'))
      }
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setApplicationError(null)
        onClose()
      }}
      title={t('hackathons.detail.participation.editApplicationModalTitle')}
      size="lg"
      className="max-h-[85vh]"
    >
      <div className="flex flex-col gap-m6 min-h-0 max-h-[calc(85vh-6rem)] overflow-y-auto">
        <ParticipationProfileFields
          variant={showRolesInApplication ? 'motivationAndRoles' : 'motivationOnly'}
          motivationText={motivation}
          onMotivationChange={setMotivation}
          teamRoles={teamRoleOptions}
          wishedRoleIds={wishedIds}
          onWishedRoleIdsChange={showRolesInApplication ? setWishedIds : undefined}
          disabled={updateApplicationMutation.isPending}
          fillHeight
          motivationRows={5}
        />
        {applicationError && <ErrorAlert message={applicationError} />}
        <div className="flex justify-end gap-m4 shrink-0 pt-m2">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={updateApplicationMutation.isPending}
          >
            {t('teams.create.cancel')}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={updateApplicationMutation.isPending}
          >
            {updateApplicationMutation.isPending
              ? t('teams.list.loading')
              : t('hackathons.detail.participation.saveApplication')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
