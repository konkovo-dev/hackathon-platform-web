'use client'

import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/entities/user/api/getUserById'
import type { PublicProfile } from '@/entities/user/model/types'

export const publicProfileQueryKey = (userId: string) => ['profile', 'public', userId] as const

export function usePublicProfileQuery(userId: string, initialData?: PublicProfile) {
  return useQuery({
    queryKey: publicProfileQueryKey(userId),
    queryFn: () => getUserById(userId),
    staleTime: 60_000,
    initialData,
  })
}
