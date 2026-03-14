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
  'LOOKING_FOR_TEAM',
  'SINGLE',
  'TEAM',
]

export function TeamModerationList({ hackathonId }: TeamModerationListProps) {
  const t = useT()
  const [selectedStatuses, setSelectedStatuses] = useState<ParticipationStatus[]>([])

  const { data, isLoading } = useParticipationsQuery(
    hackathonId,
    selectedStatuses.length > 0 ? selectedStatuses : undefined
  )

  const participations = useMemo(() => data?.participations || [], [data?.participations])

  const toggleStatus = (status: ParticipationStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const getStatusLabel = (status: ParticipationStatus) => {
    switch (status) {
      case 'LOOKING_FOR_TEAM':
        return t('hackathons.management.teams.status.lookingForTeam')
      case 'SINGLE':
        return t('hackathons.management.teams.status.single')
      case 'TEAM':
        return t('hackathons.management.teams.status.team')
      default:
        return status
    }
  }

  const stats = useMemo(() => {
    const total = participations.length
    const byStatus = participations.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1
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
                key={participation.userId}
                text={participation.userId}
                caption={`${getStatusLabel(participation.status)}${participation.teamId ? ` • Team: ${participation.teamId}` : ''}`}
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
