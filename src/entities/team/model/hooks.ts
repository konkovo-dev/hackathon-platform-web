'use client'

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import { ApiError } from '@/shared/api/errors'
import { getTeam } from '../api/getTeam'
import { getMatchmakingTeams } from '../api/getMatchmakingTeams'
import { getMatchmakingCandidates } from '../api/getMatchmakingCandidates'
import {
  listJoinRequests,
  type ListJoinRequestsRequest,
  type ListJoinRequestsResponse,
} from '../api/listJoinRequests'
import { acceptJoinRequest } from '../api/acceptJoinRequest'
import { rejectJoinRequest } from '../api/rejectJoinRequest'

const PENDING_JOIN_REQUESTS_QUERY: ListJoinRequestsRequest = {
  query: {
    filterGroups: [
      {
        filters: [
          {
            field: 'status',
            operation: 'FILTER_OPERATION_EQUAL',
            stringValue: 'TEAM_INBOX_PENDING',
          },
        ],
      },
    ],
  },
}

export async function fetchPendingJoinRequestsOrEmpty(
  hackathonId: string,
  teamId: string
): Promise<ListJoinRequestsResponse> {
  try {
    return await listJoinRequests(hackathonId, teamId, PENDING_JOIN_REQUESTS_QUERY)
  } catch (e) {
    if (e instanceof ApiError && e.data.status === 403) {
      return { requests: [] }
    }
    throw e
  }
}

export function useTeamQuery(
  hackathonId: string | null | undefined,
  teamId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['team', hackathonId, teamId],
    queryFn: () => getTeam(hackathonId!, teamId!, { includeVacancies: true }),
    enabled: (options?.enabled ?? true) && Boolean(hackathonId && teamId),
  })
}

function isMatchmakingTeamsSyncLagError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false
  const status = error.data.status
  if (status !== 400 && status !== 412) return false
  const m = error.data.message.toLowerCase()
  return m.includes('not looking') || m.includes('looking for team')
}

export function useMatchmakingTeamsQuery(
  hackathonId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['hackathon', hackathonId, 'matchmaking', 'teams'],
    queryFn: () => getMatchmakingTeams(hackathonId!),
    enabled: (options?.enabled ?? true) && Boolean(hackathonId),
    staleTime: 15_000,
    retry: (failureCount, error) =>
      failureCount < 4 && isMatchmakingTeamsSyncLagError(error),
    retryDelay: attemptIndex => Math.min(400 * 2 ** attemptIndex, 3000),
  })
}

export function useMatchmakingCandidatesQuery(
  hackathonId: string | null | undefined,
  teamId: string | null | undefined,
  vacancyId: string | null | undefined
) {
  return useQuery({
    queryKey: ['hackathon', hackathonId, 'matchmaking', 'candidates', teamId, vacancyId],
    queryFn: () => getMatchmakingCandidates(hackathonId!, teamId!, vacancyId!),
    enabled: Boolean(hackathonId && teamId && vacancyId),
    staleTime: 15_000,
  })
}

export function useJoinRequestsQuery(hackathonId: string, teamId: string) {
  return useQuery({
    queryKey: ['hackathon', hackathonId, 'team', teamId, 'join-requests'],
    queryFn: () => fetchPendingJoinRequestsOrEmpty(hackathonId, teamId),
    refetchInterval: 30_000,
    enabled: Boolean(hackathonId && teamId),
  })
}

function joinRequestsInvalidatePredicate(hackathonId: string, teamId: string) {
  return {
    queryKey: ['hackathon', hackathonId, 'team', teamId, 'join-requests'] as const,
  }
}

/** Сразу убирает заявку из кэша, чтобы список/бейджи обновились до refetch. */
function removeJoinRequestFromCache(
  queryClient: QueryClient,
  hackathonId: string,
  teamId: string,
  requestId: string
) {
  queryClient.setQueryData<ListJoinRequestsResponse>(
    ['hackathon', hackathonId, 'team', teamId, 'join-requests'],
    old => {
      if (!old?.requests?.length) return old
      const next = old.requests.filter(r => r.requestId !== requestId)
      if (next.length === old.requests.length) return old
      return { ...old, requests: next }
    }
  )
}

export function useAcceptJoinRequestMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) => acceptJoinRequest(hackathonId, teamId, requestId),
    onSuccess: async (_data, requestId) => {
      removeJoinRequestFromCache(queryClient, hackathonId, teamId, requestId)
      await Promise.all([
        queryClient.invalidateQueries(joinRequestsInvalidatePredicate(hackathonId, teamId)),
        queryClient.invalidateQueries({ queryKey: ['team', hackathonId, teamId] }),
        queryClient.invalidateQueries({ queryKey: ['team-members', hackathonId, teamId] }),
      ])
    },
  })
}

export function useRejectJoinRequestMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) => rejectJoinRequest(hackathonId, teamId, requestId),
    onSuccess: async (_data, requestId) => {
      removeJoinRequestFromCache(queryClient, hackathonId, teamId, requestId)
      await queryClient.invalidateQueries(joinRequestsInvalidatePredicate(hackathonId, teamId))
    },
  })
}
