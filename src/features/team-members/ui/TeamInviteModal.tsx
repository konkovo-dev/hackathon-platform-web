'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  InviteUserModal,
  Section,
  SelectList,
  ListItem,
  TextareaLabel,
} from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useCreateTeamInvitationMutation } from '../model/hooks'
import { listTeamRoles } from '@/entities/team'
import type { Vacancy } from '@/entities/team'
import { ApiError } from '@/shared/api/errors'

export interface TeamInviteModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  teamId: string
  vacancies: Vacancy[]
}

export function TeamInviteModal({
  open,
  onClose,
  hackathonId,
  teamId,
  vacancies,
}: TeamInviteModalProps) {
  const t = useT()
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(
    vacancies.length === 1 ? vacancies[0]?.vacancyId ?? null : null
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data: rolesData } = useQuery({
    queryKey: ['team-roles'],
    queryFn: listTeamRoles,
    enabled: open,
  })

  const rolesById = useMemo(() => {
    const list =
      rolesData?.teamRoles?.filter(
        (r): r is { id: string; name: string } => Boolean(r?.id && r?.name)
      ) ?? []
    return new Map(list.map(r => [r.id, r.name]))
  }, [rolesData])

  const createMutation = useCreateTeamInvitationMutation(hackathonId, teamId)

  const handleInvite = async (selectedUserId: string) => {
    try {
      setError(null)
      await createMutation.mutateAsync({
        targetUserId: selectedUserId,
        vacancyId: selectedVacancyId ?? undefined,
        message: message.trim() || undefined,
      })
      setMessage('')
      onClose()
    } catch (err) {
      console.error('Failed to create team invitation:', err)
      if (err instanceof ApiError) {
        const { code, message: apiMessage } = err.data
        const isServerError =
          code === '13' ||
          (typeof apiMessage === 'string' && apiMessage.toLowerCase().includes('internal error'))
        setError(
          isServerError
            ? t('teams.errors.serverErrorTryLater')
            : (apiMessage ?? t('teams.errors.inviteFailed'))
        )
      } else {
        setError(t('teams.errors.inviteFailed'))
      }
    }
  }

  return (
    <InviteUserModal
      open={open}
      onClose={() => {
        setError(null)
        onClose()
      }}
      title={t('teams.invitations.create')}
      submitLabel={t('teams.invitations.submit')}
      cancelLabel={t('teams.invitations.cancel')}
      isPending={createMutation.isPending}
      searchSectionTitle={t('teams.invitations.searchUser')}
      searchPlaceholder={t('teams.invitations.searchPlaceholder')}
      loadingLabel={t('teams.list.loading')}
      error={error}
      onInvite={handleInvite}
      middleSection={
        vacancies.length > 0 ? (
          <Section title={t('teams.invitations.selectVacancy')} variant="outlined">
            <SelectList>
              {vacancies.map(v => {
                const rolesText =
                  v.desiredRoleIds && v.desiredRoleIds.length > 0
                    ? v.desiredRoleIds
                        .map(id => rolesById.get(id) ?? id)
                        .join(', ')
                    : t('common.fallback.untitled')
                const slotsOpen = parseInt(v.slotsOpen ?? '0', 10)
                const slotsTotal = parseInt(v.slotsTotal ?? '0', 10)
                const slotsSubtitle = t('teams.vacancies.slots', {
                  open: slotsOpen,
                  total: slotsTotal,
                })
                return (
                  <ListItem
                    key={v.vacancyId}
                    text={rolesText}
                    subtitle={slotsSubtitle}
                    selectable
                    selected={selectedVacancyId === v.vacancyId}
                    variant="bordered"
                    onClick={() => setSelectedVacancyId(v.vacancyId ?? null)}
                  />
                )
              })}
            </SelectList>
          </Section>
        ) : undefined
      }
      messageSection={
        <TextareaLabel
          label={t('teams.invitations.message')}
          textareaPlaceholder={t('teams.invitations.messagePlaceholder')}
          textareaProps={{
            value: message,
            onChange: e => setMessage(e.target.value),
            rows: 3,
          }}
        />
      }
    />
  )
}
