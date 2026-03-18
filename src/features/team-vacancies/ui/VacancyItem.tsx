'use client'

import { Button } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import type { Vacancy } from '@/entities/team'

export interface VacancyItemProps {
  vacancy: Vacancy
  onEdit?: () => void
}

export function VacancyItem({ vacancy, onEdit }: VacancyItemProps) {
  const t = useT()

  const slotsOpen = parseInt(vacancy.slotsOpen ?? '0', 10)
  const slotsTotal = parseInt(vacancy.slotsTotal ?? '0', 10)

  return (
    <div className="flex flex-col gap-m3 p-m5 rounded-[var(--spacing-m3)] border border-border-default bg-bg-secondary">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-m3">
            <span className="typography-body-md-semibold text-text-primary">
              {slotsOpen > 0
                ? t('teams.vacancies.slots', { open: slotsOpen, total: slotsTotal })
                : t('teams.vacancies.slotsFull')}
            </span>
          </div>

          {vacancy.description && (
            <p className="typography-body-sm text-text-secondary mt-m2">{vacancy.description}</p>
          )}

          {vacancy.desiredRoleIds && vacancy.desiredRoleIds.length > 0 && (
            <div className="mt-m3">
              <span className="typography-body-sm text-text-tertiary">
                {t('teams.vacancies.desiredRoles')}:{' '}
              </span>
              <span className="typography-body-sm text-text-secondary">
                {vacancy.desiredRoleIds.join(', ')}
              </span>
            </div>
          )}

          {vacancy.desiredSkillIds && vacancy.desiredSkillIds.length > 0 && (
            <div className="mt-m2">
              <span className="typography-body-sm text-text-tertiary">
                {t('teams.vacancies.desiredSkills')}:{' '}
              </span>
              <span className="typography-body-sm text-text-secondary">
                {vacancy.desiredSkillIds.join(', ')}
              </span>
            </div>
          )}
        </div>

        {onEdit && (
          <Button variant="icon-secondary" size="xs" onClick={onEdit}>
            {t('teams.vacancies.edit')}
          </Button>
        )}
      </div>
    </div>
  )
}
