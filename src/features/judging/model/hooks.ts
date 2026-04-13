'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyAssignments } from '@/entities/judging/api/getMyAssignments'
import { getMyEvaluations } from '@/entities/judging/api/getMyEvaluations'
import { getLeaderboardAll } from '@/entities/judging/api/getLeaderboard'
import { submitEvaluation } from '@/entities/judging/api/submitEvaluation'
import { ApiError } from '@/shared/api/errors'

export function useMyAssignmentsQuery(
  hackathonId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['judging-assignments', hackathonId],
    queryFn: () => getMyAssignments(hackathonId!),
    enabled: Boolean(hackathonId) && (options?.enabled ?? true),
    staleTime: 30_000,
  })
}

export function useMyEvaluationsQuery(
  hackathonId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['judging-evaluations', hackathonId],
    queryFn: () => getMyEvaluations(hackathonId!),
    enabled: Boolean(hackathonId) && (options?.enabled ?? true),
    staleTime: 30_000,
  })
}

export function useJudgingLeaderboardQuery(
  hackathonId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['judging-leaderboard', hackathonId],
    queryFn: () => getLeaderboardAll(hackathonId!),
    enabled: Boolean(hackathonId) && (options?.enabled ?? true),
    staleTime: 30_000,
  })
}

export function useSubmitEvaluationMutation(hackathonId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      submissionId,
      score,
      comment,
    }: {
      submissionId: string
      score: number
      comment: string
    }) => submitEvaluation(hackathonId, submissionId, { score, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['judging-assignments', hackathonId] })
      queryClient.invalidateQueries({ queryKey: ['judging-evaluations', hackathonId] })
      queryClient.invalidateQueries({ queryKey: ['judging-leaderboard', hackathonId] })
    },
    onError: (error: ApiError) => {
      console.error('Failed to submit evaluation:', error)
    },
  })
}
