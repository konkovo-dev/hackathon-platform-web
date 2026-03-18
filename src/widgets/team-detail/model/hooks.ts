'use client'

import { useQuery } from '@tanstack/react-query'
import { getTeam } from '@/entities/team'
import { getHackathon } from '@/entities/hackathon/api/getHackathon'

export function useTeamQuery(hackathonId: string, teamId: string) {
  return useQuery({
    queryKey: ['team', hackathonId, teamId],
    queryFn: () => getTeam(hackathonId, teamId, { includeVacancies: true }),
  })
}

export function useHackathonQuery(hackathonId: string | null | undefined) {
  return useQuery({
    queryKey: ['hackathon', hackathonId],
    queryFn: () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      return getHackathon(hackathonId)
    },
    enabled: Boolean(hackathonId),
  })
}
