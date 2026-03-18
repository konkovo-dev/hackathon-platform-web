import { useQuery } from '@tanstack/react-query'
import { listParticipations } from '@/entities/hackathon/api/listParticipations'
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
