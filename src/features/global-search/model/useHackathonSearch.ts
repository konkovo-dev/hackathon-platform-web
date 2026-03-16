import { useQuery } from '@tanstack/react-query'
import { getHackathonList } from '@/entities/hackathon/api/getHackathonList'
import { useDebouncedValue } from '@/shared/lib/hooks/useDebouncedValue'

export function useHackathonSearch(searchQuery: string) {
  const debouncedQuery = useDebouncedValue(searchQuery, 300)
  const enabled = debouncedQuery.length >= 2

  return useQuery({
    queryKey: ['hackathons', 'search', debouncedQuery],
    queryFn: () =>
      getHackathonList(
        {
          stage: 'all',
          formats: [],
          sortDirection: 'asc',
          searchQuery: debouncedQuery,
          skipStageFilter: true,
        },
        undefined,
        20
      ),
    enabled,
  })
}
