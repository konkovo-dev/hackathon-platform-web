'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listMyStaffInvitations,
  listMyTeamInvitations,
  acceptStaffInvitation,
  rejectStaffInvitation,
  acceptTeamInvitation,
  rejectTeamInvitation,
} from '@/entities/invitation'
import { useSessionQuery } from '@/features/auth/model/hooks'

export function useStaffInvitationsQuery() {
  const sessionQuery = useSessionQuery()
  const isAuthed = sessionQuery.data?.active === true

  return useQuery({
    queryKey: ['my-staff-invitations'],
    queryFn: listMyStaffInvitations,
    refetchInterval: 30000,
    enabled: isAuthed,
  })
}

export function useTeamInvitationsQuery() {
  const sessionQuery = useSessionQuery()
  const isAuthed = sessionQuery.data?.active === true

  return useQuery({
    queryKey: ['my-team-invitations'],
    queryFn: listMyTeamInvitations,
    refetchInterval: 30000,
    enabled: isAuthed,
  })
}

export function useActiveInvitationsCount() {
  const staffQuery = useStaffInvitationsQuery()
  const teamQuery = useTeamInvitationsQuery()

  const staffPending =
    staffQuery.data?.invitations?.filter(inv => inv.status === 'STAFF_INVITATION_PENDING').length ??
    0
  const teamPending =
    teamQuery.data?.invitations?.filter(inv => inv.status === 'TEAM_INBOX_PENDING').length ?? 0

  return {
    count: staffPending + teamPending,
    isLoading: staffQuery.isLoading || teamQuery.isLoading,
  }
}

export function useAcceptStaffInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptStaffInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-staff-invitations'] })
    },
  })
}

export function useRejectStaffInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rejectStaffInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-staff-invitations'] })
    },
  })
}

export function useAcceptTeamInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptTeamInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team-invitations'] })
    },
  })
}

export function useRejectTeamInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rejectTeamInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team-invitations'] })
    },
  })
}
