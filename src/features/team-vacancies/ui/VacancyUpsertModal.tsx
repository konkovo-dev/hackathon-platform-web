'use client'

import { useState } from 'react'
import { ErrorAlert, Modal, InputLabel, Section, Button } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useUpsertVacancyMutation } from '../model/hooks'
import type { Vacancy } from '@/entities/team'
import { ApiError } from '@/shared/api/errors'

export interface VacancyUpsertModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  teamId: string
  vacancy?: Vacancy
}

export function VacancyUpsertModal({
  open,
  onClose,
  hackathonId,
  teamId,
  vacancy,
}: VacancyUpsertModalProps) {
  const t = useT()
  const [description, setDescription] = useState(vacancy?.description || '')
  const [desiredRoles, setDesiredRoles] = useState(vacancy?.desiredRoleIds?.join(', ') || '')
  const [desiredSkills, setDesiredSkills] = useState(vacancy?.desiredSkillIds?.join(', ') || '')
  const [slotsTotal, setSlotsTotal] = useState(vacancy?.slotsTotal || '1')
  const [error, setError] = useState<string | null>(null)

  const upsertMutation = useUpsertVacancyMutation(hackathonId, teamId)

  const handleSave = async () => {
    const slots = parseInt(slotsTotal, 10)
    if (isNaN(slots) || slots < 1) {
      setError(t('teams.errors.updateFailed'))
      return
    }

    try {
      setError(null)
      await upsertMutation.mutateAsync({
        vacancyId: vacancy?.vacancyId,
        description: description.trim() || undefined,
        desiredRoleIds: desiredRoles
          ? desiredRoles
              .split(',')
              .map(r => r.trim())
              .filter(Boolean)
          : undefined,
        desiredSkillIds: desiredSkills
          ? desiredSkills
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          : undefined,
        slotsTotal: String(slots),
      })
      onClose()
      resetForm()
    } catch (err) {
      console.error('Failed to upsert vacancy:', err)
      if (err instanceof ApiError) {
        setError(err.data.message || t('teams.errors.updateFailed'))
      } else {
        setError(t('teams.errors.updateFailed'))
      }
    }
  }

  const resetForm = () => {
    setDescription('')
    setDesiredRoles('')
    setDesiredSkills('')
    setSlotsTotal('1')
    setError(null)
  }

  const handleClose = () => {
    onClose()
    setError(null)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={vacancy ? t('teams.vacancies.edit') : t('teams.vacancies.create')}
      size="lg"
    >
      <div className="flex flex-col gap-m6">
        <Section variant="outlined">
          <div className="flex flex-col gap-m4">
            <div className="flex flex-col gap-m2">
              <label
                htmlFor="vacancy-description"
                className="typography-label-md text-text-primary"
              >
                {t('teams.vacancies.description')}
              </label>
              <textarea
                id="vacancy-description"
                className="rounded-[var(--spacing-m3)] border border-border-primary bg-bg-secondary px-m5 py-m4 typography-body-md text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-focus resize-none"
                placeholder={t('teams.vacancies.descriptionPlaceholder')}
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                autoFocus
              />
            </div>

            <InputLabel
              label={t('teams.vacancies.desiredRoles')}
              inputPlaceholder={t('teams.vacancies.desiredRoles')}
              inputProps={{
                value: desiredRoles,
                onChange: e => setDesiredRoles(e.target.value),
              }}
            />

            <InputLabel
              label={t('teams.vacancies.desiredSkills')}
              inputPlaceholder={t('teams.vacancies.desiredSkills')}
              inputProps={{
                value: desiredSkills,
                onChange: e => setDesiredSkills(e.target.value),
              }}
            />

            <InputLabel
              label={t('teams.vacancies.slotsTotal')}
              inputPlaceholder={t('teams.vacancies.slotsTotal')}
              inputProps={{
                value: slotsTotal,
                onChange: e => setSlotsTotal(e.target.value),
              }}
            />
          </div>
        </Section>

        {error && <ErrorAlert message={error} />}

        <div className="flex gap-m4 justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={upsertMutation.isPending}
          >
            {t('teams.vacancies.cancel')}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={upsertMutation.isPending}
          >
            {upsertMutation.isPending ? t('teams.list.loading') : t('teams.vacancies.submit')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
