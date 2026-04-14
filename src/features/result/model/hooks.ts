'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getHackathonResult,
  getMyEvaluationResult,
  publishHackathonResult,
  updateHackathonResultDraft,
} from '@/entities/result'

const resultKey = (hackathonId: string) => ['hackathon', 'result', hackathonId] as const
const myResultKey = (hackathonId: string) => ['hackathon', 'myResult', hackathonId] as const

export function useHackathonResultQuery(hackathonId: string | null | undefined, enabled: boolean) {
  return useQuery({
    queryKey: hackathonId ? resultKey(hackathonId) : ['hackathon', 'result', 'none'],
    queryFn: async () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      return getHackathonResult(hackathonId)
    },
    enabled: Boolean(hackathonId) && enabled,
    staleTime: 30_000,
  })
}

export function useMyEvaluationResultQuery(
  hackathonId: string | null | undefined,
  enabled: boolean
) {
  return useQuery({
    queryKey: hackathonId ? myResultKey(hackathonId) : ['hackathon', 'myResult', 'none'],
    queryFn: async () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      return getMyEvaluationResult(hackathonId)
    },
    enabled: Boolean(hackathonId) && enabled,
    staleTime: 30_000,
  })
}

export function useUpdateHackathonResultDraftMutation(hackathonId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (result: string) =>
      updateHackathonResultDraft(hackathonId, {
        result,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: resultKey(hackathonId) })
    },
  })
}

export function usePublishHackathonResultMutation(hackathonId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => publishHackathonResult(hackathonId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: resultKey(hackathonId) })
      await queryClient.invalidateQueries({ queryKey: ['hackathon', 'detail', hackathonId] })
      await queryClient.invalidateQueries({ queryKey: myResultKey(hackathonId) })
    },
  })
}
