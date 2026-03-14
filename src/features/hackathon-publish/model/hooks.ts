import { useMutation, useQueryClient } from '@tanstack/react-query'
import { publishHackathon } from '@/entities/hackathon/api/publishHackathon'
import { ApiError } from '@/shared/api/errors'

export function usePublishHackathonMutation(hackathonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      publishHackathon(hackathonId, {
        idempotencyKey: crypto.randomUUID(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathon', hackathonId] })
      queryClient.invalidateQueries({ queryKey: ['hackathon-context', hackathonId] })
    },
    onError: (error: ApiError) => {
      console.error('Failed to publish hackathon:', error)
    },
  })
}
