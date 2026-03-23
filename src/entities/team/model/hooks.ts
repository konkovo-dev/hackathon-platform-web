'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTeam } from '../api/getTeam'
import { getMatchmakingTeams } from '../api/getMatchmakingTeams'
import { getMatchmakingCandidates } from '../api/getMatchmakingCandidates'
import { listJoinRequests, type ListJoinRequestsRequest } from '../api/listJoinRequests'
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

export function useMatchmakingTeamsQuery(hackathonId: string | null | undefined) {
  return useQuery({
    queryKey: ['hackathon', hackathonId, 'matchmaking', 'teams'],
    queryFn: () => getMatchmakingTeams(hackathonId!),
    enabled: Boolean(hackathonId),
    staleTime: 15_000,
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
    queryFn: () => listJoinRequests(hackathonId, teamId, PENDING_JOIN_REQUESTS_QUERY),
    refetchInterval: 30_000,
    enabled: Boolean(hackathonId && teamId),
  })
}

function joinRequestsInvalidatePredicate(hackathonId: string, teamId: string) {
  return {
    queryKey: ['hackathon', hackathonId, 'team', teamId, 'join-requests'] as const,
  }
}

export function useAcceptJoinRequestMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) => acceptJoinRequest(hackathonId, teamId, requestId),
    onSuccess: () => {
      queryClient.invalidateQueries(joinRequestsInvalidatePredicate(hackathonId, teamId))
    },
  })
}

export function useRejectJoinRequestMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) => rejectJoinRequest(hackathonId, teamId, requestId),
    onSuccess: () => {
      queryClient.invalidateQueries(joinRequestsInvalidatePredicate(hackathonId, teamId))
    },
  })
}
