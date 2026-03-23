'use client'

import { useT } from '@/shared/i18n/useT'
import { useMyTeamsQuery } from '../model/hooks'
import { TeamCard } from '@/features/teams-list'
import { MyOutgoingJoinRequests } from './MyOutgoingJoinRequests'

export function MyTeamsList() {
  const t = useT()
  const { data, isLoading } = useMyTeamsQuery()

  const myTeams = data?.myTeams ?? []

  return (
    <div className="flex flex-col gap-m8">
      <MyOutgoingJoinRequests />
      {isLoading ? (
        <p className="typography-body-sm text-text-secondary">{t('teams.list.loading')}</p>
      ) : myTeams.length === 0 ? (
        <p className="typography-body-sm text-text-secondary">{t('teams.my.empty')}</p>
      ) : (
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
      )}
    </div>
  )
}
