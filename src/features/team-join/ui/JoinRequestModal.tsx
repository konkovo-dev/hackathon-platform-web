'use client'

import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ErrorAlert, Modal, SelectList, ListItem, Button, TextareaLabel } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useCreateJoinRequestMutation } from '../model/hooks'
import type { Vacancy } from '@/entities/team'
import { listTeamRoles } from '@/entities/team'
import { ApiError } from '@/shared/api/errors'

export interface JoinRequestModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  teamId: string
  vacancies: Vacancy[]
  /** Pre-select vacancy when opening (e.g. matchmaking best vacancy). */
  initialVacancyId?: string | null
}

export function JoinRequestModal({
  open,
  onClose,
  hackathonId,
  teamId,
  vacancies,
  initialVacancyId,
}: JoinRequestModalProps) {
  const t = useT()
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && initialVacancyId) {
      setSelectedVacancyId(initialVacancyId)
    }
  }, [open, initialVacancyId])

  const createMutation = useCreateJoinRequestMutation(hackathonId, teamId)

  const { data: rolesData } = useQuery({
    queryKey: ['team-roles'],
    queryFn: listTeamRoles,
    enabled: open,
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

  const handleClose = () => {
    setSelectedVacancyId(null)
    setMessage('')
    setError(null)
    onClose()
  }

  const vacancyRowTitle = (v: Vacancy) => {
    const slotsOpen = parseInt(v.slotsOpen ?? '0', 10)
    const slotsTotal = parseInt(v.slotsTotal ?? '0', 10)
    const slotsText = t('teams.vacancies.slots', { open: slotsOpen, total: slotsTotal })
    const roleLabels = (v.desiredRoleIds ?? [])
      .map(id => rolesById.get(id))
      .filter((label): label is string => Boolean(label))
    return roleLabels.length > 0 ? roleLabels.join(', ') : slotsText
  }

  const handleSubmit = async () => {
    if (!selectedVacancyId) return

    try {
      setError(null)
      await createMutation.mutateAsync({
        vacancyId: selectedVacancyId,
        message: message.trim() || undefined,
      })
      handleClose()
    } catch (err) {
      console.error('Failed to create join request:', err)
      if (err instanceof ApiError) {
        setError(err.data.message || t('teams.errors.joinFailed'))
      } else {
        setError(t('teams.errors.joinFailed'))
      }
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('teams.join.title')} size="lg">
      <div className="flex flex-col gap-m6">
        {vacancies.length === 0 ? (
          <p className="typography-body-sm text-text-secondary">{t('teams.join.noVacancies')}</p>
        ) : (
          <SelectList>
            {vacancies.map(v => (
              <ListItem
                key={v.vacancyId}
                text={vacancyRowTitle(v)}
                subtitle={
                  v.description?.trim() ? v.description : t('hackathons.detail.no_description')
                }
                selectable
                selected={selectedVacancyId === v.vacancyId}
                variant="bordered"
                onClick={() => setSelectedVacancyId(v.vacancyId!)}
              />
            ))}
          </SelectList>
        )}

        <TextareaLabel
          label={t('teams.join.message')}
          textareaPlaceholder={t('teams.join.messagePlaceholder')}
          textareaId="join-request-message"
          textareaProps={{
            value: message,
            onChange: e => setMessage(e.target.value),
            rows: 4,
          }}
        />

        {error && <ErrorAlert message={error} />}

        <div className="flex flex-wrap gap-m4 justify-end">
          <Button
            variant="secondary"
            size="md"
            type="button"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            {t('teams.join.cancel')}
          </Button>
          <Button
            variant="primary"
            size="md"
            type="button"
            onClick={handleSubmit}
            disabled={!selectedVacancyId || createMutation.isPending}
          >
            {createMutation.isPending ? t('teams.list.loading') : t('teams.join.submit')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
