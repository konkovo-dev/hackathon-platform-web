'use client'

import { useState } from 'react'
import { Button, ListItem, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import type { Vacancy } from '@/entities/team'

export interface VacancyItemProps {
  vacancy: Vacancy
  rolesById?: Map<string, string>
  onEdit?: () => void
  onDelete?: () => void
  onMatchmakingCandidates?: () => void
  canManage?: boolean
}

export function VacancyItem({
  vacancy,
  rolesById,
  onEdit,
  onDelete,
  onMatchmakingCandidates,
  canManage,
}: VacancyItemProps) {
  const t = useT()
  const [isHovered, setIsHovered] = useState(false)

  const slotsOpen = parseInt(vacancy.slotsOpen ?? '0', 10)
  const slotsTotal = parseInt(vacancy.slotsTotal ?? '0', 10)
  const slotsCaption =
    slotsOpen > 0
      ? t('teams.vacancies.slots', { open: slotsOpen, total: slotsTotal })
      : t('teams.vacancies.slotsFull')

  const positionsText =
    vacancy.desiredRoleIds && vacancy.desiredRoleIds.length > 0
      ? vacancy.desiredRoleIds.map(id => rolesById?.get(id) ?? id).join(', ')
      : t('common.fallback.untitled')

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.()
  }

  const rightContent =
    onMatchmakingCandidates || (canManage && isHovered && onDelete) ? (
      <div className="flex gap-m2 items-center" onClick={e => e.stopPropagation()}>
        {onMatchmakingCandidates && (
          <Button
            variant="secondary"
            size="xs"
            onClick={e => {
              e.stopPropagation()
              onMatchmakingCandidates()
            }}
          >
            {t('teams.matchmaking.suitableCandidates')}
          </Button>
        )}
        {canManage && isHovered && onDelete && (
          <Button
            variant="icon-secondary"
            size="xs"
            onClick={handleDelete}
            aria-label={t('teams.vacancies.delete')}
          >
            <Icon src="/icons/icon-delete/icon-delete-xs.svg" size="xs" color="secondary" />
          </Button>
        )}
      </div>
    ) : undefined

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <ListItem
        text={positionsText}
        caption={slotsCaption}
        variant="bordered"
        onClick={onEdit}
        rightContent={rightContent}
      />
    </div>
  )
}
