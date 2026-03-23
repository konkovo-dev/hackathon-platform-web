import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type GetMatchmakingCandidatesResponse =
  operations['MatchmakingService_RecommendCandidates']['responses']['200']['content']['application/json']

export async function getMatchmakingCandidates(
  hackathonId: string,
  teamId: string,
  vacancyId: string,
  limit = 20
): Promise<GetMatchmakingCandidatesResponse> {
  const params = new URLSearchParams({
    teamId,
    vacancyId,
    limit: String(limit),
  })
  return platformFetchJson<GetMatchmakingCandidatesResponse>(
    `/v1/hackathons/${hackathonId}/matchmaking/candidates?${params}`,
    { method: 'GET' }
  )
}
