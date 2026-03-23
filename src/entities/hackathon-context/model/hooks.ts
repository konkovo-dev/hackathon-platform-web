'use client'

import { useQuery } from '@tanstack/react-query'
import { getMyParticipation } from '../api/getMyParticipation'
import { hackathonMyParticipationQueryKey } from './queryKeys'

/**
 * My participation (teamId, status) for binding canInMyTeam to current page. Not for access decisions.
 */
export function useMyParticipationQuery(hackathonId: string | null | undefined) {
  return useQuery({
    queryKey: hackathonId
      ? hackathonMyParticipationQueryKey(hackathonId)
      : ['hackathon', 'participation', 'me', 'none'],
    queryFn: () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      return getMyParticipation(hackathonId)
    },
    enabled: Boolean(hackathonId),
    staleTime: 15_000,
    retry: 1,
  })
}
