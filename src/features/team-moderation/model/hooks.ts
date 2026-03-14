import { useQuery } from '@tanstack/react-query'
import { listParticipations } from '@/entities/hackathon/api/listParticipations'
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
