import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type GetMatchmakingTeamsResponse =
  operations['MatchmakingService_RecommendTeams']['responses']['200']['content']['application/json']

export async function getMatchmakingTeams(
  hackathonId: string,
  limit = 20
): Promise<GetMatchmakingTeamsResponse> {
  const params = new URLSearchParams({ limit: String(limit) })
  return platformFetchJson<GetMatchmakingTeamsResponse>(
    `/v1/hackathons/${hackathonId}/matchmaking/teams?${params}`,
    { method: 'GET' }
  )
}
