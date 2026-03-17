'use client'

import { useQuery } from '@tanstack/react-query'
import { getHackathon } from '@/entities/hackathon/api/getHackathon'
import { getHackathonAnnouncements } from '@/entities/hackathon/api/getHackathonAnnouncements'
import { getHackathonTask } from '@/entities/hackathon/api/getHackathonTask'
import type { Hackathon } from '@/entities/hackathon/model/types'

const detailKey = (hackathonId: string) => ['hackathon', 'detail', hackathonId] as const
const announcementsKey = (hackathonId: string) =>
  ['hackathon', 'announcements', hackathonId] as const
const taskKey = (hackathonId: string) => ['hackathon', 'task', hackathonId] as const

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

export function useHackathonAnnouncementsQuery(
  hackathonId: string | null | undefined,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: hackathonId ? announcementsKey(hackathonId) : ['hackathon', 'announcements', 'none'],
    queryFn: async () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      try {
        return await getHackathonAnnouncements(hackathonId)
      } catch (error: any) {
        if (error?.status === 403) {
          return []
        }
        throw error
      }
    },
    enabled: Boolean(hackathonId) && enabled,
    staleTime: 60_000,
    retry: (failureCount, error: any) => {
      if (error?.status === 403) return false
      return failureCount < 3
    },
  })
}

export function useHackathonTaskQuery(
  hackathonId: string | null | undefined,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: hackathonId ? taskKey(hackathonId) : ['hackathon', 'task', 'none'],
    queryFn: async () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      const task = await getHackathonTask(hackathonId)
      return task ?? ''
    },
    enabled: Boolean(hackathonId) && enabled,
    staleTime: 60_000,
    retry: (failureCount, error: any) => {
      if (error?.status === 403 || error?.status === 404) return false
      return failureCount < 3
    },
  })
}
