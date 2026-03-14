import { useQuery } from '@tanstack/react-query'
import { validateHackathon } from '@/entities/hackathon/api/validateHackathon'

export function useValidateHackathonQuery(hackathonId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['hackathon', 'validate', hackathonId],
    queryFn: () => validateHackathon(hackathonId),
    enabled,
    refetchInterval: 30_000, // Обновляем каждые 30 секунд
  })
}
