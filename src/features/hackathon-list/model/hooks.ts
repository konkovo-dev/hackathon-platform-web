import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { getHackathonList } from '@/entities/hackathon/api/getHackathonList'
import type { HackathonListResponse, HackathonListFilters } from '@/entities/hackathon/model/types'

export function useHackathonListQuery(
  filters: HackathonListFilters,
  initialData?: HackathonListResponse
) {
  return useQuery({
    queryKey: ['hackathons', 'list', filters],
    queryFn: () => getHackathonList(filters),
    staleTime: 60_000,
    initialData,
  })
}

export function useInfiniteHackathonListQuery(
  filters: HackathonListFilters,
  initialData?: HackathonListResponse
) {
  return useInfiniteQuery({
    queryKey: ['hackathons', 'list', 'infinite', filters],
    queryFn: ({ pageParam }) => getHackathonList(filters, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.page.hasMore ? lastPage.page.nextPageToken : undefined
    },
    initialPageParam: undefined as string | undefined,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    staleTime: 60_000,
  })
}
