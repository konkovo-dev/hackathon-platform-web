'use client'

import { randomUUID } from '@/shared/lib/randomUuid'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateParticipationRelatedQueries } from '@/entities/hackathon-context/model/invalidateParticipationRelatedQueries'
import {
  listTeamMembers,
  leaveTeam,
  kickTeamMember,
  transferCaptain,
  createTeamInvitation,
} from '@/entities/team'
import { batchGetUsers } from '@/entities/user/api/batchGetUsers'

export function useTeamMembersQuery(hackathonId: string, teamId: string) {
  return useQuery({
    queryKey: ['team-members', hackathonId, teamId],
    queryFn: () => listTeamMembers(hackathonId, teamId),
  })
}

export function useTeamMemberUsersQuery(userIds: string[]) {
  return useQuery({
    queryKey: ['users-batch', userIds],
    queryFn: async () => {
      const response = await batchGetUsers({ userIds })
      return {
        users:
          (response.users ?? [])
            .map(u => u.user)
            .filter((u): u is NonNullable<typeof u> => u != null) || [],
      }
    },
    enabled: userIds.length > 0,
  })
}

export function useCreateTeamInvitationMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { targetUserId: string; vacancyId?: string; message?: string }) =>
      createTeamInvitation(hackathonId, teamId, {
        idempotencyKey: { key: randomUUID() },
        ...params,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', hackathonId, teamId] })
      queryClient.invalidateQueries({ queryKey: ['team-members', hackathonId, teamId] })
    },
  })
}

export function useLeaveTeamMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => leaveTeam(hackathonId, teamId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['team-members', hackathonId, teamId] }),
        invalidateParticipationRelatedQueries(queryClient, hackathonId, { teamId }),
      ])
    },
  })
}

export function useKickMemberMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => kickTeamMember(hackathonId, teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members', hackathonId, teamId] })
      queryClient.invalidateQueries({ queryKey: ['team', hackathonId, teamId] })
    },
  })
}

export function useTransferCaptainMutation(hackathonId: string, teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newCaptainUserId: string) =>
      transferCaptain(hackathonId, teamId, {
        targetUserId: newCaptainUserId,
        idempotencyKey: {
          key: randomUUID(),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members', hackathonId, teamId] })
      queryClient.invalidateQueries({ queryKey: ['team', hackathonId, teamId] })
    },
  })
}
