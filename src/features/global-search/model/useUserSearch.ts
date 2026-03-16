import { useQuery } from '@tanstack/react-query'
import { listUsers } from '@/entities/user/api/listUsers'
import { useDebouncedValue } from '@/shared/lib/hooks/useDebouncedValue'

export function useUserSearch(searchQuery: string, isAuthed: boolean) {
  const debouncedQuery = useDebouncedValue(searchQuery, 300)
  const enabled = isAuthed && debouncedQuery.length >= 2

  return useQuery({
    queryKey: ['users', 'search', debouncedQuery],
    queryFn: () =>
      listUsers({
        query: {
          q: debouncedQuery,
          limit: 20,
        },
        includeContacts: false,
        includeSkills: false,
      }),
    enabled,
  })
}
