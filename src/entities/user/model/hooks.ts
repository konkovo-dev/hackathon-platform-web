'use client'

import { useQuery } from '@tanstack/react-query'
import { listUsers } from '../api/listUsers'

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
        users: (response.users ?? [])
          .map(u => u.user)
          .filter((u): u is NonNullable<typeof u> => u != null),
        page: response.page,
      }
    },
    enabled: searchQuery.length >= 2,
  })
}
