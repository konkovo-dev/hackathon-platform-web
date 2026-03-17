'use client'

import { useQuery } from '@tanstack/react-query'
import { getTeam } from '@/entities/team'

export function useTeamQuery(hackathonId: string, teamId: string) {
  return useQuery({
    queryKey: ['team', hackathonId, teamId],
    queryFn: () => getTeam(hackathonId, teamId, { includeVacancies: true }),
  })
}
