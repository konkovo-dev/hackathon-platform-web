'use client'

import { useQuery } from '@tanstack/react-query'
import { getHackathonsByRole, type RoleFilter } from '../api/getHackathonsByRole'

export function hackathonsByRoleQueryKey(role: RoleFilter) {
  return ['hackathons', 'dashboard', 'role', role] as const
}

export function useHackathonsByRoleQuery(
  role: RoleFilter,
  options?: { enabled?: boolean; pageSize?: number }
) {
  const pageSize = options?.pageSize ?? 20
  return useQuery({
    queryKey: hackathonsByRoleQueryKey(role),
    queryFn: () => getHackathonsByRole(role, pageSize),
    staleTime: 60_000,
    enabled: options?.enabled ?? true,
  })
}
