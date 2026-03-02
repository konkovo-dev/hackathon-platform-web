import { useQuery } from '@tanstack/react-query'
import { listSkillCatalog } from '../api/listSkillCatalog'

export function useSkillCatalogQuery() {
  return useQuery({
    queryKey: ['skill-catalog'],
    queryFn: () => listSkillCatalog({ query: { page: { pageSize: 100 } } }),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}
