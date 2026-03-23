'use client'

import { useQuery } from '@tanstack/react-query'
import { listTeams } from '@/entities/team'

export function useTeamsQuery(hackathonId: string | null | undefined, searchQuery?: string) {
  return useQuery({
    queryKey: ['teams', hackathonId, searchQuery],
    queryFn: () =>
      listTeams(hackathonId!, {
        includeVacancies: true,
        query: searchQuery
          ? {
              q: searchQuery,
            }
          : undefined,
      }),
    enabled: !!hackathonId,
  })
}
