'use client'

import { randomUUID } from '@/shared/lib/randomUuid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { upsertVacancy } from '@/entities/team'

export function useUpsertVacancyMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      vacancyId?: string
      description?: string
      desiredRoleIds?: string[]
      desiredSkillIds?: string[]
      slotsTotal: string
    }) =>
      upsertVacancy(hackathonId, teamId, {
        idempotencyKey: {
          key: randomUUID(),
        },
        ...params,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', hackathonId, teamId] })
      queryClient.invalidateQueries({ queryKey: ['teams', hackathonId] })
    },
  })
}
