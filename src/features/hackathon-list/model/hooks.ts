import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { getHackathonList } from '@/entities/hackathon/api/getHackathonList'
import type { HackathonListResponse, HackathonListFilters } from '@/entities/hackathon/model/types'

export function useHackathonListQuery(
  filters: HackathonListFilters,
  initialData?: HackathonListResponse
) {
  return useQuery({
    queryKey: [
      'hackathons',
      'list',
      filters.stage,
      filters.formats,
      filters.city,
      filters.sortDirection,
    ],
    queryFn: () => getHackathonList(filters),
    staleTime: 60_000,
    initialData,
  })
}

export function useInfiniteHackathonListQuery(
  filters: HackathonListFilters,
  initialData?: HackathonListResponse
) {
  const queryKey = [
    'hackathons',
    'list',
    'infinite',
    filters.stage,
    (filters.formats ?? []).join(','),
    filters.city ?? '',
    filters.sortDirection,
  ] as const

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getHackathonList(filters, pageParam),
    getNextPageParam: lastPage => {
      return lastPage.page?.hasMore ? lastPage.page?.nextPageToken : undefined
    },
    initialPageParam: undefined as string | undefined,
    initialData: initialData ? { pages: [initialData], pageParams: [undefined] } : undefined,
  })
}
