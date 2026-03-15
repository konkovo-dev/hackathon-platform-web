'use client'

import { useState, useMemo } from 'react'
import { Section, ListItem, SelectList, Chip, ChipList } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useParticipationsQuery } from '../model/hooks'
import type { ParticipationStatus } from '@/entities/hackathon/api/listParticipations'

export interface TeamModerationListProps {
  hackathonId: string
}

const STATUS_OPTIONS: ParticipationStatus[] = [
  'PART_LOOKING_FOR_TEAM',
  'PART_INDIVIDUAL',
  'PART_TEAM_MEMBER',
  'PART_TEAM_CAPTAIN',
]

export function TeamModerationList({ hackathonId }: TeamModerationListProps) {
  const t = useT()
  const [selectedStatuses, setSelectedStatuses] = useState<ParticipationStatus[]>([])

  const { data, isLoading } = useParticipationsQuery(
    hackathonId,
    selectedStatuses.length > 0 ? selectedStatuses : undefined
  )

  const participations = useMemo(() => data?.participants || [], [data?.participants])

  const toggleStatus = (status: ParticipationStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const getStatusLabel = (status: ParticipationStatus) => {
    switch (status) {
      case 'PART_LOOKING_FOR_TEAM':
        return t('hackathons.management.teams.status.lookingForTeam')
      case 'PART_INDIVIDUAL':
        return t('hackathons.management.teams.status.single')
      case 'PART_TEAM_MEMBER':
      case 'PART_TEAM_CAPTAIN':
        return t('hackathons.management.teams.status.team')
      default:
        return status
    }
  }

  const stats = useMemo(() => {
    const total = participations.length
    const byStatus = participations.reduce((acc, p) => {
      const status = p.status ?? 'PARTICIPATION_STATUS_UNSPECIFIED'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { total, byStatus }
  }, [participations])

  return (
    <Section title={t('hackathons.management.teams.title')}>
      <div className="flex flex-col gap-m6">
        <div className="flex flex-col gap-m4">
          <p className="typography-body-sm text-text-secondary">
            {t('hackathons.management.teams.total')}: {stats.total}
          </p>

          <ChipList>
            {STATUS_OPTIONS.map(status => (
              <Chip
                key={status}
                label={`${getStatusLabel(status)} (${stats.byStatus[status] || 0})`}
                variant={selectedStatuses.includes(status) ? 'primary' : 'secondary'}
                onClick={() => toggleStatus(status)}
              />
            ))}
          </ChipList>
        </div>

        {isLoading ? (
          <p className="typography-body-sm text-text-secondary">{t('hackathons.list.loading')}</p>
        ) : participations.length > 0 ? (
          <SelectList>
            {participations.map(participation => (
              <ListItem
                key={participation.userId ?? 'unknown'}
                text={participation.userId ?? t('common.fallback.unknown_user')}
                caption={`${getStatusLabel(participation.status ?? 'PARTICIPATION_STATUS_UNSPECIFIED')}${participation.teamId ? ` • Team: ${participation.teamId}` : ''}`}
                variant="bordered"
              />
            ))}
          </SelectList>
        ) : (
          <p className="typography-body-sm text-text-secondary">
            {t('hackathons.management.teams.empty')}
          </p>
        )}
      </div>
    </Section>
  )
}
