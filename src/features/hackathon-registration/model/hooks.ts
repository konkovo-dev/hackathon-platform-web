'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registerForHackathon } from '@/entities/hackathon/api/registerForHackathon'
import { switchParticipationMode } from '@/entities/hackathon-context/api/switchParticipationMode'
import { updateMyParticipation } from '@/entities/hackathon-context/api/updateMyParticipation'
import { invalidateParticipationRelatedQueries } from '@/entities/hackathon-context/model/invalidateParticipationRelatedQueries'

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
    onSuccess: async () => {
      await invalidateParticipationRelatedQueries(queryClient, hackathonId)
    },
  })
}

export function useSwitchParticipationModeMutation(hackathonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { newStatus: 'PART_INDIVIDUAL' | 'PART_LOOKING_FOR_TEAM' }) =>
      switchParticipationMode(hackathonId, {
        idempotencyKey: { key: crypto.randomUUID() },
        newStatus: params.newStatus,
      }),
    onSuccess: async () => {
      await invalidateParticipationRelatedQueries(queryClient, hackathonId)
    },
  })
}

export function useUpdateMyParticipationMutation(hackathonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { motivationText?: string; wishedRoleIds?: string[] }) =>
      updateMyParticipation(hackathonId, {
        idempotencyKey: { key: crypto.randomUUID() },
        ...(params.motivationText !== undefined ? { motivationText: params.motivationText } : {}),
        ...(params.wishedRoleIds !== undefined ? { wishedRoleIds: params.wishedRoleIds } : {}),
      }),
    onSuccess: async () => {
      await invalidateParticipationRelatedQueries(queryClient, hackathonId)
    },
  })
}
