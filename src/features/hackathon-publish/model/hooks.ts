import { useMutation, useQueryClient } from '@tanstack/react-query'
import { publishHackathon } from '@/entities/hackathon/api/publishHackathon'

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
      queryClient.invalidateQueries({ queryKey: ['hackathon-context', hackathonId] })
      queryClient.invalidateQueries({ queryKey: ['hackathon', 'validate', hackathonId] })
    },
  })
}
