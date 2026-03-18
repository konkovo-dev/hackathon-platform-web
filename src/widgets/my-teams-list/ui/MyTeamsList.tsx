'use client'

import { useT } from '@/shared/i18n/useT'
import { useMyTeamsQuery } from '../model/hooks'
import { TeamCard } from '@/features/teams-list'

export function MyTeamsList() {
  const t = useT()
  const { data, isLoading } = useMyTeamsQuery()

  if (isLoading) {
    return <p className="typography-body-sm text-text-secondary">{t('teams.list.loading')}</p>
  }

  const myTeams = data?.myTeams ?? []

  if (myTeams.length === 0) {
    return <p className="typography-body-sm text-text-secondary">{t('teams.my.empty')}</p>
  }

  return (
    <div className="flex flex-col gap-m6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-m6">
        {myTeams.map(({ hackathon, teamWithVacancies }) => {
          const hackathonId = hackathon.hackathonId
          if (!hackathonId || !teamWithVacancies.team?.teamId) return null
          return (
            <TeamCard
              key={`${hackathonId}-${teamWithVacancies.team!.teamId}`}
              hackathonId={hackathonId}
              teamWithVacancies={teamWithVacancies}
              hackathonName={hackathon.name}
            />
          )
        })}
      </div>
    </div>
  )
}
