import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'
import type { TeamWithVacancies } from '../model/types'

export type ListTeamsRequest =
  operations['TeamService_ListTeams']['requestBody']['content']['application/json']

export type ListTeamsResponse =
  operations['TeamService_ListTeams']['responses']['200']['content']['application/json']

const LIST_ALL_TEAMS_PAGE_SIZE = 200

export async function listTeams(
  hackathonId: string,
  request: ListTeamsRequest = {}
): Promise<ListTeamsResponse> {
  return platformFetchJson<ListTeamsResponse>(`/v1/hackathons/${hackathonId}/teams/list`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

/**
 * Загружает все команды хакатона постранично (для справочников id → название и т.п.).
 */
export async function listAllTeams(
  hackathonId: string,
  options?: { includeVacancies?: boolean }
): Promise<TeamWithVacancies[]> {
  const includeVacancies = options?.includeVacancies ?? false
  const result: TeamWithVacancies[] = []
  let pageToken: string | undefined
  const maxPages = 100

  for (let page = 0; page < maxPages; page++) {
    const res = await listTeams(hackathonId, {
      includeVacancies,
      query: {
        page: { pageSize: LIST_ALL_TEAMS_PAGE_SIZE, pageToken },
      },
    })
    result.push(...(res.teams ?? []))
    const p = res.page
    if (!p?.hasMore || !p?.nextPageToken) break
    pageToken = p.nextPageToken
  }

  return result
}
