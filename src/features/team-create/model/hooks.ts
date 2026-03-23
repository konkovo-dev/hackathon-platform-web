'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTeam } from '@/entities/team'
import { hackathonMyParticipationQueryKey } from '@/entities/hackathon-context/model/queryKeys'

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', hackathonId] })
      queryClient.invalidateQueries({ queryKey: ['hackathon-teams-name-map', hackathonId] })
      queryClient.invalidateQueries({ queryKey: hackathonMyParticipationQueryKey(hackathonId) })
    },
  })
}
