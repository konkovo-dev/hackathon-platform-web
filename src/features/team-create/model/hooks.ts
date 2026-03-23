'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTeam } from '@/entities/team'
import { invalidateParticipationRelatedQueries } from '@/entities/hackathon-context/model/invalidateParticipationRelatedQueries'

export function useCreateTeamMutation(hackathonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { name: string; description?: string; isJoinable?: boolean }) =>
      createTeam(hackathonId, {
        idempotencyKey: {
          key: crypto.randomUUID(),
        },
        ...params,
      }),
    onSuccess: async data => {
      await invalidateParticipationRelatedQueries(queryClient, hackathonId, {
        teamId: data.teamId,
      })
    },
  })
}
