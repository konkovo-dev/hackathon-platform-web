import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  getHackathonsByRole,
  getHackathonsByParticipation,
  type RoleFilter,
} from '@/entities/hackathon/api/getHackathonsByRole'
import type { Hackathon } from '@/entities/hackathon/model/types'

export function useHackathonsByRoleQuery(role: RoleFilter) {
  return useQuery({
    queryKey: ['hackathons', 'dashboard', 'role', role],
    queryFn: () => getHackathonsByRole(role, 20),
    staleTime: 60_000,
  })
}

export function useHackathonsByParticipationQuery() {
  return useQuery({
    queryKey: ['hackathons', 'dashboard', 'participation'],
    queryFn: () => getHackathonsByParticipation(),
    staleTime: 60_000,
  })
}

function mergeOwnerAndOrganizerHackathons(
  ownerHackathons: Hackathon[] = [],
  organizerHackathons: Hackathon[] = []
): Hackathon[] {
  const byId = new Map<string, Hackathon>()
  for (const h of ownerHackathons) {
    if (h.hackathonId) byId.set(h.hackathonId, h)
  }
  for (const h of organizerHackathons) {
    if (h.hackathonId && !byId.has(h.hackathonId)) byId.set(h.hackathonId, h)
  }
  return Array.from(byId.values())
}

export function useDashboardHackathonsQuery() {
  const ownerQuery = useHackathonsByRoleQuery('owner')
  const organizerRoleQuery = useHackathonsByRoleQuery('organizer')
  const juryQuery = useHackathonsByRoleQuery('judge')
  const mentorQuery = useHackathonsByRoleQuery('mentor')
  const participantQuery = useHackathonsByParticipationQuery()

  const organizerHackathons = useMemo(
    () =>
      mergeOwnerAndOrganizerHackathons(
        ownerQuery.data?.hackathons,
        organizerRoleQuery.data?.hackathons
      ),
    [ownerQuery.data?.hackathons, organizerRoleQuery.data?.hackathons]
  )

  const organizer = {
    ...ownerQuery,
    data: ownerQuery.data
      ? { ...ownerQuery.data, hackathons: organizerHackathons }
      : undefined,
    isLoading: ownerQuery.isLoading || organizerRoleQuery.isLoading,
    error: ownerQuery.error ?? organizerRoleQuery.error,
  }

  return {
    organizer,
    jury: juryQuery,
    mentor: mentorQuery,
    participant: participantQuery,
    isLoading:
      ownerQuery.isLoading ||
      organizerRoleQuery.isLoading ||
      juryQuery.isLoading ||
      mentorQuery.isLoading ||
      participantQuery.isLoading,
  }
}
