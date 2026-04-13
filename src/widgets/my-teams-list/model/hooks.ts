'use client'

import { useQueries, useQuery } from '@tanstack/react-query'
import { getHackathonsByParticipation } from '@/entities/hackathon/api/getHackathonsByRole'
import { getMyParticipation } from '@/entities/hackathon-context/api/getMyParticipation'
import { normalizeHackathonStage } from '@/entities/hackathon-context/model/types'
import {
  getTeam,
  fetchPendingJoinRequestsOrEmpty,
  listMyJoinRequests,
  countPendingJoinRequests,
} from '@/entities/team'
import { useSessionQuery } from '@/features/auth/model/hooks'
import type { Hackathon } from '@/entities/hackathon'
import type { TeamWithVacancies } from '@/entities/team'

export type MyTeamEntry = {
  hackathon: Hackathon
  teamWithVacancies: TeamWithVacancies
}

export function useMyTeamsQuery() {
  return useQuery({
    queryKey: ['my-teams'],
    queryFn: async (): Promise<{ myTeams: MyTeamEntry[] }> => {
      const { hackathons } = await getHackathonsByParticipation()
      if (!hackathons?.length) return { myTeams: [] }

      const myTeams: MyTeamEntry[] = []

      await Promise.all(
        hackathons.map(async hackathon => {
          const hackathonId = hackathon.hackathonId
          if (!hackathonId) return

          const { teamId } = await getMyParticipation(hackathonId)
          if (!teamId) return

          const res = await getTeam(hackathonId, teamId, { includeVacancies: true })
          if (!res.team) return

          const hackathonNormalized: Hackathon = {
            ...hackathon,
            stage: normalizeHackathonStage(hackathon.stage as string | undefined),
          }
          myTeams.push({
            hackathon: hackathonNormalized,
            teamWithVacancies: res.team,
          })
        })
      )

      return { myTeams }
    },
  })
}

/** Сумма ожидающих входящих заявок в команду по всем «моим» командам (для бейджа в сайдбаре). */
export function usePendingJoinRequestsInboxCount() {
  const { data: myTeamsData, isLoading: myTeamsLoading } = useMyTeamsQuery()
  const teams = myTeamsData?.myTeams ?? []

  const joinRequestQueries = useQueries({
    queries: teams.map(({ hackathon, teamWithVacancies }) => {
      const hackathonId = hackathon.hackathonId ?? ''
      const teamId = teamWithVacancies.team?.teamId ?? ''
      return {
        queryKey: ['hackathon', hackathonId, 'team', teamId, 'join-requests'] as const,
        queryFn: () => fetchPendingJoinRequestsOrEmpty(hackathonId, teamId),
        enabled: Boolean(hackathonId && teamId),
        staleTime: 30_000,
        refetchInterval: 30_000,
      }
    }),
  })

  const count = joinRequestQueries.reduce(
    (sum, r) => sum + countPendingJoinRequests(r.data?.requests),
    0
  )
  const isLoading =
    myTeamsLoading || joinRequestQueries.some(q => q.isPending && q.fetchStatus !== 'idle')

  return { count, isLoading }
}

/** Исходящие заявки пользователя (POST /v1/users/me/join-requests/list). */
export function useMyJoinRequestsQuery() {
  const sessionQuery = useSessionQuery()
  const isAuthed = sessionQuery.data?.active === true

  return useQuery({
    queryKey: ['me', 'join-requests'],
    queryFn: () => listMyJoinRequests({}),
    enabled: isAuthed,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}
