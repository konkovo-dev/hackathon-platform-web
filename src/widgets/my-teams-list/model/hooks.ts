'use client'

import { useQuery } from '@tanstack/react-query'
import { getHackathonsByParticipation } from '@/entities/hackathon/api/getHackathonsByRole'
import { getMyParticipation } from '@/entities/hackathon-context/api/getMyParticipation'
import { normalizeHackathonStage } from '@/entities/hackathon-context/model/types'
import { getTeam } from '@/entities/team'
import type { Hackathon } from '@/entities/hackathon'
import type { TeamWithVacancies } from '@/entities/team'

export type MyTeamEntry = {
  hackathon: Hackathon
  teamWithVacancies: TeamWithVacancies
}

export function useMyTeamsQuery() {
  return useQuery({
    queryKey: ['my-teams'],
    queryFn: async (): Promise<{ myTeams: MyTeamEntry[] }> => {
      const { hackathons } = await getHackathonsByParticipation()
      if (!hackathons?.length) return { myTeams: [] }

      const myTeams: MyTeamEntry[] = []

      await Promise.all(
        hackathons.map(async hackathon => {
          const hackathonId = hackathon.hackathonId
          if (!hackathonId) return

          const { teamId } = await getMyParticipation(hackathonId)
          if (!teamId) return

          const res = await getTeam(hackathonId, teamId, { includeVacancies: true })
          if (!res.team) return

          const hackathonNormalized: Hackathon = {
            ...hackathon,
            stage: normalizeHackathonStage(hackathon.stage as string | undefined),
          }
          myTeams.push({
            hackathon: hackathonNormalized,
            teamWithVacancies: res.team,
          })
        })
      )

      return { myTeams }
    },
  })
}
