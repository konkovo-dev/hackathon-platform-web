'use client'

import { useQuery } from '@tanstack/react-query'
import { getHackathonPermissions } from '../api/getHackathonPermissions'

const queryKey = (hackathonId: string) => ['hackathon', 'permissions', hackathonId] as const

export type UseHackathonPermissionsQueryOptions = {
  enabled?: boolean
}

export function useHackathonPermissionsQuery(
  hackathonId: string | null | undefined,
  options?: UseHackathonPermissionsQueryOptions
) {
  const enabled = (options?.enabled ?? true) && Boolean(hackathonId)
  return useQuery({
    queryKey: hackathonId ? queryKey(hackathonId) : ['hackathon', 'permissions', 'none'],
    queryFn: () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      return getHackathonPermissions(hackathonId)
    },
    enabled,
    staleTime: 15_000,
    retry: 1,
  })
}
