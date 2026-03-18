'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Section, Button, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { listTeamRoles } from '@/entities/team'
import type { Vacancy } from '@/entities/team'
import { VacancyItem } from './VacancyItem'

export interface VacanciesListProps {
  vacancies: Vacancy[]
  onEdit?: (vacancy: Vacancy) => void
  onDelete?: (vacancy: Vacancy) => void
  onAdd?: () => void
  canManage?: boolean
}

export function VacanciesList({
  vacancies,
  onEdit,
  onDelete,
  onAdd,
  canManage,
}: VacanciesListProps) {
  const t = useT()
  const { data: rolesData } = useQuery({
    queryKey: ['team-roles'],
    queryFn: listTeamRoles,
  })

  const rolesById = useMemo(() => {
    const list = rolesData?.teamRoles?.filter(
      (r): r is { id: string; name: string } => Boolean(r?.id && r?.name)
    ) ?? []
    return new Map(list.map(r => [r.id, r.name]))
  }, [rolesData])

  return (
    <Section
      title={t('teams.vacancies.title')}
      variant="elevated"
      action={
        canManage && onAdd ? (
          <Button
            variant="icon-secondary"
            size="xs"
            onClick={onAdd}
            aria-label={t('teams.vacancies.add')}
          >
            <Icon src="/icons/icon-plus/icon-plus-xs.svg" size="xs" color="secondary" />
          </Button>
        ) : undefined
      }
    >
      {vacancies.length === 0 ? (
        <p className="typography-body-sm text-text-secondary">{t('teams.vacancies.empty')}</p>
      ) : (
        <div className="flex flex-col gap-m4">
          {vacancies.map(vacancy => (
            <VacancyItem
              key={vacancy.vacancyId}
              vacancy={vacancy}
              rolesById={rolesById}
              onEdit={canManage && onEdit ? () => onEdit(vacancy) : undefined}
              onDelete={canManage && onDelete ? () => onDelete(vacancy) : undefined}
              canManage={canManage}
            />
          ))}
        </div>
      )}
    </Section>
  )
}
