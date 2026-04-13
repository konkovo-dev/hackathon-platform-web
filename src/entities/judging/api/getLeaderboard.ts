import { platformFetchJson } from '@/shared/api/platformClient'
import type { components, operations } from '@/shared/api/platform.schema'

export type LeaderboardEntry = components['schemas']['v1LeaderboardEntry']
export type GetLeaderboardBody = components['schemas']['JudgingServiceGetLeaderboardBody']
type GetLeaderboardResponse =
  operations['JudgingService_GetLeaderboard']['responses']['200']['content']['application/json']

const PAGE_SIZE = 100
const MAX_PAGES = 50

export async function getLeaderboard(
  hackathonId: string,
  body: GetLeaderboardBody = {}
): Promise<GetLeaderboardResponse> {
  return platformFetchJson<GetLeaderboardResponse>(
    `/v1/hackathons/${hackathonId}/judging/leaderboard`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
}

/**
 * Загружает все страницы лидерборда (offset/limit в теле запроса).
 */
export async function getLeaderboardAll(
  hackathonId: string
): Promise<{ entries: LeaderboardEntry[] }> {
  const entries: LeaderboardEntry[] = []
  let offset = 0

  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await getLeaderboard(hackathonId, {
      query: { limit: PAGE_SIZE, offset },
    })
    const batch = res.entries ?? []
    entries.push(...batch)

    const hasMore = res.page?.hasMore === true
    if (!hasMore && batch.length < PAGE_SIZE) break
    if (batch.length === 0) break
    offset += PAGE_SIZE
    if (!hasMore) break
  }

  return { entries }
}
