'use client'

import { useQuery } from '@tanstack/react-query'
import { getHackathon } from '@/entities/hackathon/api/getHackathon'
import { getHackathonAnnouncements } from '@/entities/hackathon/api/getHackathonAnnouncements'
import type { Hackathon } from '@/entities/hackathon/model/types'

const detailKey = (hackathonId: string) => ['hackathon', 'detail', hackathonId] as const
const announcementsKey = (hackathonId: string) =>
  ['hackathon', 'announcements', hackathonId] as const

export function useHackathonDetailQuery(
  hackathonId: string | null | undefined,
  initialData?: Hackathon
) {
  return useQuery({
    queryKey: hackathonId ? detailKey(hackathonId) : ['hackathon', 'detail', 'none'],
    queryFn: () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      return getHackathon(hackathonId, {
        includeDescription: true,
        includeLinks: true,
        includeLimits: true,
      })
    },
    enabled: Boolean(hackathonId),
    initialData,
    staleTime: 30_000,
  })
}

export function useHackathonAnnouncementsQuery(hackathonId: string | null | undefined) {
  return useQuery({
    queryKey: hackathonId ? announcementsKey(hackathonId) : ['hackathon', 'announcements', 'none'],
    queryFn: () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      return getHackathonAnnouncements(hackathonId)
    },
    enabled: Boolean(hackathonId),
    staleTime: 60_000,
  })
}
