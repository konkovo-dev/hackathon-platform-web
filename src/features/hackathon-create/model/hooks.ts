'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createHackathon } from '../api/createHackathon'
import type { CreateHackathonRequest } from '../api/createHackathon'

export function useCreateHackathonMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateHackathonRequest) => createHackathon(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] })
    },
  })
}
