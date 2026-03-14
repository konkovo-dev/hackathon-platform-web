import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateHackathonTask, type UpdateHackathonTaskRequest } from '../api/updateHackathonTask'

export function useUpdateHackathonTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateHackathonTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hackathon', 'detail', variables.hackathonId] })
      queryClient.invalidateQueries({ queryKey: ['hackathon', 'validate', variables.hackathonId] })
    },
  })
}
