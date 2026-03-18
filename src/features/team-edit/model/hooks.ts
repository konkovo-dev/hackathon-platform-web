'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTeam, deleteTeam } from '@/entities/team'

export function useUpdateTeamMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { name?: string; description?: string; isJoinable?: boolean }) =>
      updateTeam(hackathonId, teamId, {
        idempotencyKey: {
          key: crypto.randomUUID(),
        },
        ...params,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', hackathonId, teamId] })
      queryClient.invalidateQueries({ queryKey: ['teams', hackathonId] })
    },
  })
}

export function useDeleteTeamMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteTeam(hackathonId, teamId, crypto.randomUUID()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', hackathonId] })
      queryClient.invalidateQueries({ queryKey: ['hackathon-context', hackathonId] })
    },
  })
}
