import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listHackathonStaff } from '@/entities/hackathon/api/listHackathonStaff'
import { createStaffInvitation } from '@/entities/hackathon/api/createStaffInvitation'
import { listUsers } from '@/entities/user/api/listUsers'
import { batchGetUsers } from '@/entities/user/api/batchGetUsers'
import type { HackathonRole } from '@/entities/hackathon/api/listHackathonStaff'
import { ApiError } from '@/shared/api/errors'

export function useStaffListQuery(hackathonId: string | null | undefined) {
  return useQuery({
    queryKey: ['hackathon-staff', hackathonId],
    queryFn: () => listHackathonStaff(hackathonId!),
    enabled: !!hackathonId,
  })
}

export function useStaffUsersQuery(userIds: string[]) {
  return useQuery({
    queryKey: ['users-batch', userIds],
    queryFn: () => batchGetUsers({ userIds }),
    enabled: userIds.length > 0,
  })
}

export function useUsersSearchQuery(searchQuery: string) {
  return useQuery({
    queryKey: ['users-search', searchQuery],
    queryFn: () =>
      listUsers({
        query: {
          q: searchQuery,
          page: { pageSize: 20 },
        },
      }),
    enabled: searchQuery.length >= 2,
  })
}

export function useCreateStaffInvitationMutation(hackathonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { targetUserId: string; requestedRole: HackathonRole; message?: string }) =>
      createStaffInvitation(hackathonId, {
        idempotencyKey: {
          key: crypto.randomUUID(),
        },
        ...params,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathon-staff', hackathonId] })
    },
    onError: (error: ApiError) => {
      console.error('Failed to create staff invitation:', error)
    },
  })
}
