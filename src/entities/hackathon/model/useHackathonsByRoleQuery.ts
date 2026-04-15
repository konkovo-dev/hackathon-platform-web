'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getHackathonsByRole, type RoleFilter } from '../api/getHackathonsByRole'

export function hackathonsByRoleQueryKey(
  role: RoleFilter,
  opts?: { includeOwnerDrafts?: boolean }
) {
  return [
    'hackathons',
    'dashboard',
    'role',
    role,
    role === 'owner' ? Boolean(opts?.includeOwnerDrafts) : null,
  ] as const
}

export function useHackathonsByRoleQuery(
  role: RoleFilter,
  options?: { enabled?: boolean; pageSize?: number; includeOwnerDrafts?: boolean }
) {
  const pageSize = options?.pageSize ?? 20
  const includeOwnerDrafts = options?.includeOwnerDrafts
  return useQuery({
    queryKey: hackathonsByRoleQueryKey(role, { includeOwnerDrafts }),
    queryFn: () =>
      getHackathonsByRole(role, pageSize, {
        includeOwnerDrafts: role === 'owner' ? includeOwnerDrafts : undefined,
      }),
    staleTime: 60_000,
    enabled: options?.enabled ?? true,
    placeholderData: role === 'owner' ? keepPreviousData : undefined,
  })
}
