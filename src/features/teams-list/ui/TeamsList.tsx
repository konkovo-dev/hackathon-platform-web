'use client'

import { useState } from 'react'
import { Input } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useTeamsQuery } from '../model/hooks'
import { TeamCard } from './TeamCard'

export interface TeamsListProps {
  hackathonId: string
}

export function TeamsList({ hackathonId }: TeamsListProps) {
  const t = useT()
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading } = useTeamsQuery(hackathonId, searchQuery || undefined)

  const teams = data?.teams || []

  return (
    <div className="flex flex-col gap-m8">
      <Input
        variant="search"
        placeholder={t('hackathons.management.staff.searchPlaceholder')}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery('')}
      />

      {isLoading ? (
        <p className="typography-body-sm text-text-secondary">{t('teams.list.loading')}</p>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-m6">
          {teams.map(teamWithVacancies => {
            if (!teamWithVacancies.team?.teamId) return null
            return (
              <TeamCard
                key={teamWithVacancies.team.teamId}
                hackathonId={hackathonId}
                teamWithVacancies={teamWithVacancies}
              />
            )
          })}
        </div>
      ) : (
        <p className="typography-body-sm text-text-secondary">
          {searchQuery ? t('hackathons.management.staff.noUsersFound') : t('teams.list.empty')}
        </p>
      )}
    </div>
  )
}
