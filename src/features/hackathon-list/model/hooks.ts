import { useQuery } from '@tanstack/react-query'
import { getHackathonList } from '@/entities/hackathon/api/getHackathonList'
import type { HackathonListResponse } from '@/entities/hackathon/model/types'

export function useHackathonListQuery(initialData?: HackathonListResponse) {
  return useQuery({
    queryKey: ['hackathons', 'list'],
    queryFn: getHackathonList,
    staleTime: 60_000,
    initialData,
  })
}
