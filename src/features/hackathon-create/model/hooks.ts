'use client'

import type { QueryClient } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getHackathon } from '@/entities/hackathon/api/getHackathon'
import {
  getHackathonPermissions,
  type HackathonPermissionsBundle,
} from '@/entities/hackathon-permissions/api/getHackathonPermissions'
import { createHackathon } from '../api/createHackathon'
import type { CreateHackathonRequest } from '../api/createHackathon'

const CREATOR_HACKATHON_PERMISSIONS = {
  readDraft: true,
  manageHackathon: true,
  publishHackathon: true,
  createAnnouncement: true,
  viewAnnouncements: true,
  readTask: true,
  readResultDraft: true,
  updateResultDraft: true,
  publishResult: true,
  viewResultPublic: true,
} as const

export async function prefetchHackathonPageData(
  queryClient: QueryClient,
  hackathonId: string
): Promise<void> {
  const permissionsKey = ['hackathon', 'permissions', hackathonId] as const
  const detailKey = ['hackathon', 'detail', hackathonId] as const

  await Promise.all([
    queryClient
      .prefetchQuery({
        queryKey: permissionsKey,
        queryFn: () => getHackathonPermissions(hackathonId),
      })
      .catch(() => {}),
    queryClient.prefetchQuery({
      queryKey: detailKey,
      queryFn: () =>
        getHackathon(hackathonId, {
          includeDescription: true,
          includeLinks: true,
          includeLimits: true,
        }),
    }),
  ])

  const existing = queryClient.getQueryData<HackathonPermissionsBundle>(permissionsKey)
  const merged: HackathonPermissionsBundle = {
    hackathon: {
      ...existing?.hackathon,
      ...CREATOR_HACKATHON_PERMISSIONS,
    },
    participation: existing?.participation,
    team: existing?.team,
    judging: existing?.judging,
  }
  queryClient.setQueryData(permissionsKey, merged)
}

export function useCreateHackathonMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateHackathonRequest) => createHackathon(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] })
      if (data.hackathonId) {
        queryClient.invalidateQueries({ queryKey: ['hackathon', 'permissions', data.hackathonId] })
        queryClient.invalidateQueries({ queryKey: ['hackathon', 'detail', data.hackathonId] })
      }
    },
  })
}
