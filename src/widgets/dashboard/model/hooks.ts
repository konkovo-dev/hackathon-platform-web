import { useQuery } from '@tanstack/react-query'
import { 
  getHackathonsByRole, 
  getHackathonsByParticipation, 
  type RoleFilter 
} from '@/entities/hackathon/api/getHackathonsByRole'

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

export function useDashboardHackathonsQuery() {
  const organizerQuery = useHackathonsByRoleQuery('owner')
  const juryQuery = useHackathonsByRoleQuery('judge')
  const mentorQuery = useHackathonsByRoleQuery('mentor')
  const participantQuery = useHackathonsByParticipationQuery()

  return {
    organizer: organizerQuery,
    jury: juryQuery,
    mentor: mentorQuery,
    participant: participantQuery,
    isLoading: 
      organizerQuery.isLoading || 
      juryQuery.isLoading || 
      mentorQuery.isLoading || 
      participantQuery.isLoading,
  }
}
