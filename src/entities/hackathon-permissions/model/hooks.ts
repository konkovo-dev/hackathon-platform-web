'use client'

import { useQuery } from '@tanstack/react-query'
import { getHackathonPermissions } from '../api/getHackathonPermissions'

const queryKey = (hackathonId: string) => ['hackathon', 'permissions', hackathonId] as const

export function useHackathonPermissionsQuery(hackathonId: string | null | undefined) {
  return useQuery({
    queryKey: hackathonId ? queryKey(hackathonId) : ['hackathon', 'permissions', 'none'],
    queryFn: () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      return getHackathonPermissions(hackathonId)
    },
    enabled: Boolean(hackathonId),
    staleTime: 15_000,
    retry: 1,
  })
}
