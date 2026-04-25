'use client'

import { randomUUID } from '@/shared/lib/randomUuid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createJoinRequest } from '@/entities/team'

export function useCreateJoinRequestMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { vacancyId: string; message?: string }) =>
      createJoinRequest(hackathonId, teamId, {
        idempotencyKey: {
          key: randomUUID(),
        },
        ...params,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', hackathonId, teamId] })
      queryClient.invalidateQueries({
        queryKey: ['hackathon', hackathonId, 'team', teamId, 'join-requests'],
      })
      queryClient.invalidateQueries({ queryKey: ['me', 'join-requests'] })
    },
  })
}
