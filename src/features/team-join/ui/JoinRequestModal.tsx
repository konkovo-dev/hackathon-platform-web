'use client'

import { useState, useEffect } from 'react'
import { ErrorAlert, Modal, SelectList, ListItem, Section, Button } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useCreateJoinRequestMutation } from '../model/hooks'
import type { Vacancy } from '@/entities/team'
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

  const handleClose = () => {
    setSelectedVacancyId(null)
    setMessage('')
    setError(null)
    onClose()
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
        <Section title={t('teams.join.selectVacancy')} variant="outlined">
          {vacancies.length === 0 ? (
            <p className="typography-body-sm text-text-secondary">{t('teams.join.noVacancies')}</p>
          ) : (
            <SelectList>
              {vacancies.map(v => {
                const slotsOpen = parseInt(v.slotsOpen ?? '0', 10)
                const slotsTotal = parseInt(v.slotsTotal ?? '0', 10)
                return (
                  <ListItem
                    key={v.vacancyId}
                    text={
                      v.description ||
                      t('teams.vacancies.slots', { open: slotsOpen, total: slotsTotal })
                    }
                    subtitle={v.desiredSkillIds?.join(', ')}
                    selectable
                    selected={selectedVacancyId === v.vacancyId}
                    variant="bordered"
                    onClick={() => setSelectedVacancyId(v.vacancyId!)}
                  />
                )
              })}
            </SelectList>
          )}
        </Section>

        <Section title={t('teams.join.message')} variant="outlined">
          <textarea
            className="w-full rounded-[var(--spacing-m3)] border border-border-primary bg-bg-secondary px-m5 py-m4 typography-body-md text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-focus resize-none"
            placeholder={t('teams.join.messagePlaceholder')}
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
          />
        </Section>

        {error && <ErrorAlert message={error} />}

        <div className="flex gap-m4 justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            {t('teams.join.cancel')}
          </Button>
          <Button
            variant="primary"
            size="md"
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
