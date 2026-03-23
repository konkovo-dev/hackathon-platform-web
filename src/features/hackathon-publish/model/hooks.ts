import { useMutation, useQueryClient } from '@tanstack/react-query'
import { publishHackathon } from '@/entities/hackathon/api/publishHackathon'
import { hackathonMyParticipationQueryKey } from '@/entities/hackathon-context/model/queryKeys'

export function usePublishHackathonMutation(hackathonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      publishHackathon(hackathonId, {
        idempotencyKey: {
          key: crypto.randomUUID(),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] })
      queryClient.invalidateQueries({ queryKey: ['hackathon', hackathonId] })
      queryClient.invalidateQueries({ queryKey: ['hackathon', 'detail', hackathonId] })
      queryClient.invalidateQueries({ queryKey: hackathonMyParticipationQueryKey(hackathonId) })
      queryClient.invalidateQueries({ queryKey: ['hackathon', 'validate', hackathonId] })
    },
  })
}
