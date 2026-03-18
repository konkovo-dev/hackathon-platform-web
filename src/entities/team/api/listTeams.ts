import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type ListTeamsRequest =
  operations['TeamService_ListTeams']['requestBody']['content']['application/json']

export type ListTeamsResponse =
  operations['TeamService_ListTeams']['responses']['200']['content']['application/json']

export async function listTeams(
  hackathonId: string,
  request: ListTeamsRequest = {}
): Promise<ListTeamsResponse> {
  return platformFetchJson<ListTeamsResponse>(`/v1/hackathons/${hackathonId}/teams/list`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
