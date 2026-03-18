import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateHackathon, type UpdateHackathonRequest } from '../api/updateHackathon'

export function useUpdateHackathonMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateHackathon,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] })
      queryClient.invalidateQueries({ queryKey: ['hackathon', 'detail', variables.hackathonId] })
      queryClient.invalidateQueries({
        queryKey: ['hackathon', 'announcements', variables.hackathonId],
      })
      queryClient.invalidateQueries({ queryKey: ['hackathon', 'validate', variables.hackathonId] })
    },
  })
}
