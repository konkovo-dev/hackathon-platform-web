import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnnouncement } from '@/entities/hackathon/api/createAnnouncement'
import { ApiError } from '@/shared/api/errors'

export function useCreateAnnouncementMutation(hackathonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { title: string; body: string }) =>
      createAnnouncement(hackathonId, {
        idempotencyKey: crypto.randomUUID(),
        ...params,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathon-announcements', hackathonId] })
    },
    onError: (error: ApiError) => {
      console.error('Failed to create announcement:', error)
    },
  })
}
