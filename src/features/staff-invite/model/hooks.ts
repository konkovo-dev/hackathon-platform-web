import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listHackathonStaff } from '@/entities/hackathon/api/listHackathonStaff'
import { listHackathonStaffInvitations } from '@/entities/hackathon/api/listHackathonStaffInvitations'
import { createStaffInvitation } from '@/entities/hackathon/api/createStaffInvitation'
import { cancelStaffInvitation } from '@/entities/hackathon/api/cancelStaffInvitation'
import { removeHackathonRole } from '@/entities/hackathon/api/removeHackathonRole'
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
    queryFn: async () => {
      const response = await batchGetUsers({ userIds })
      return {
        users: (response.users ?? []).map(u => u.user).filter((u): u is NonNullable<typeof u> => u != null)
      }
    },
    enabled: userIds.length > 0,
  })
}

export function useUsersSearchQuery(searchQuery: string) {
  return useQuery({
    queryKey: ['users-search', searchQuery],
    queryFn: async () => {
      const response = await listUsers({
        query: {
          q: searchQuery,
          page: { pageSize: 20 },
        },
      })
      return {
        users: (response.users ?? []).map(u => u.user).filter((u): u is NonNullable<typeof u> => u != null),
        page: response.page,
      }
    },
    enabled: searchQuery.length >= 2,
  })
}

export function useHackathonStaffInvitationsQuery(
  hackathonId: string | null | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: ['hackathon-staff-invitations', hackathonId],
    queryFn: () => listHackathonStaffInvitations(hackathonId!),
    enabled: !!hackathonId && enabled,
  })
}

export function useCancelStaffInvitationMutation(hackathonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invitationId: string) =>
      cancelStaffInvitation(hackathonId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathon-staff-invitations', hackathonId] })
      queryClient.invalidateQueries({ queryKey: ['hackathon-staff', hackathonId] })
    },
    onError: (error: ApiError) => {
      console.error('Failed to cancel staff invitation:', error)
    },
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
      queryClient.invalidateQueries({ queryKey: ['hackathon-staff-invitations', hackathonId] })
    },
    onError: (error: ApiError) => {
      console.error('Failed to create staff invitation:', error)
    },
  })
}

export function useRemoveStaffRoleMutation(hackathonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { userId: string; role: HackathonRole }) =>
      removeHackathonRole(hackathonId, {
        userId: params.userId,
        role: params.role,
        idempotencyKey: { key: crypto.randomUUID() },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathon-staff', hackathonId] })
    },
    onError: (error: ApiError) => {
      console.error('Failed to remove staff role:', error)
    },
  })
}
