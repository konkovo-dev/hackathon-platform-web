import { useQuery } from '@tanstack/react-query'
import { listParticipations } from '@/entities/hackathon/api/listParticipations'
import { listAllTeams } from '@/entities/team'
import { batchGetUsers } from '@/entities/user/api/batchGetUsers'
import type { ParticipationStatus } from '@/entities/hackathon/api/listParticipations'

export function useParticipationsQuery(
  hackathonId: string | null | undefined,
  statusFilter?: ParticipationStatus[]
) {
  return useQuery({
    queryKey: ['hackathon-participations', hackathonId, statusFilter],
    queryFn: () =>
      listParticipations(hackathonId!, {
        statusFilter: statusFilter ? { statuses: statusFilter } : undefined,
      }),
    enabled: !!hackathonId,
  })
}

export function useParticipationUsersQuery(userIds: string[]) {
  return useQuery({
    queryKey: ['users-batch', userIds],
    queryFn: async () => {
      const response = await batchGetUsers({ userIds })
      return {
        users: (response.users ?? [])
          .map(u => u.user)
          .filter((u): u is NonNullable<typeof u> => u != null),
      }
    },
    enabled: userIds.length > 0,
  })
}

/** Справочник teamId → отображаемое название команды (для списков участников). */
export function useHackathonTeamsNameMapQuery(hackathonId: string | null | undefined) {
  return useQuery({
    queryKey: ['hackathon-teams-name-map', hackathonId],
    queryFn: () => listAllTeams(hackathonId!, { includeVacancies: false }),
    enabled: !!hackathonId,
    select: (teams): Map<string, string> => {
      const map = new Map<string, string>()
      for (const tw of teams) {
        const id = tw.team?.teamId
        const name = tw.team?.name
        if (id && name) map.set(id, name)
      }
      return map
    },
  })
}
