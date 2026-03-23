'use client'

import { useQuery } from '@tanstack/react-query'
import { useTeamQuery as useTeamQueryEntity } from '@/entities/team/model/hooks'
import { getHackathon } from '@/entities/hackathon/api/getHackathon'

export function useTeamQuery(hackathonId: string, teamId: string) {
  return useTeamQueryEntity(hackathonId, teamId)
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
