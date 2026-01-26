'use client'

import { useQuery } from '@tanstack/react-query'
import { getHackathonContext } from '../api/getHackathonContext'

const key = (hackathonId: string) => ['hackathon', 'context', hackathonId] as const

export function useHackathonContextQuery(hackathonId: string | null | undefined) {
  return useQuery({
    queryKey: hackathonId ? key(hackathonId) : ['hackathon', 'context', 'none'],
    queryFn: () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      return getHackathonContext(hackathonId)
    },
    enabled: Boolean(hackathonId),
    staleTime: 15_000,
  })
}
