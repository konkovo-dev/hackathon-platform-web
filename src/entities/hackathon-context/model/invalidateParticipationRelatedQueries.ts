import type { QueryClient } from '@tanstack/react-query'
import { hackathonMyParticipationQueryKey } from './queryKeys'

/**
 * Обновляет кэш после изменений участия/регистрации, чтобы пермишены и списки совпадали с сервером.
 */
export async function invalidateParticipationRelatedQueries(
  queryClient: QueryClient,
  hackathonId: string,
  options?: { teamId?: string }
) {
  const teamId = options?.teamId
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['teams', hackathonId] }),
    queryClient.invalidateQueries({ queryKey: ['hackathon-teams-name-map', hackathonId] }),
    queryClient.invalidateQueries({ queryKey: hackathonMyParticipationQueryKey(hackathonId) }),
    queryClient.invalidateQueries({ queryKey: ['hackathon', 'permissions', hackathonId] }),
    queryClient.invalidateQueries({ queryKey: ['hackathon', 'detail', hackathonId] }),
    queryClient.invalidateQueries({ queryKey: ['hackathons'] }),
    queryClient.invalidateQueries({ queryKey: ['hackathons', 'dashboard'] }),
    queryClient.invalidateQueries({ queryKey: ['my-teams'] }),
    teamId
      ? queryClient.invalidateQueries({ queryKey: ['team', hackathonId, teamId] })
      : Promise.resolve(),
  ])
}
