'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registerForHackathon } from '@/entities/hackathon/api/registerForHackathon'

export function useRegisterForHackathonMutation(hackathonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params?: {
      desiredStatus?: 'PART_INDIVIDUAL' | 'PART_LOOKING_FOR_TEAM'
      motivationText?: string
      wishedRoleIds?: string[]
    }) =>
      registerForHackathon(hackathonId, {
        idempotencyKey: { key: crypto.randomUUID() },
        desiredStatus: params?.desiredStatus ?? 'PART_INDIVIDUAL',
        ...(params?.motivationText != null && params.motivationText !== ''
          ? { motivationText: params.motivationText }
          : {}),
        ...(params?.wishedRoleIds != null && params.wishedRoleIds.length > 0
          ? { wishedRoleIds: params.wishedRoleIds }
          : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathon', 'context', hackathonId] })
      queryClient.invalidateQueries({ queryKey: ['hackathon-detail', hackathonId] })
    },
  })
}
