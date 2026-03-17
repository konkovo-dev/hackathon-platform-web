import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type GetTeamParams = operations['TeamService_GetTeam']['parameters']['query']

export type GetTeamResponse =
  operations['TeamService_GetTeam']['responses']['200']['content']['application/json']

export async function getTeam(
  hackathonId: string,
  teamId: string,
  params: GetTeamParams = {}
): Promise<GetTeamResponse> {
  const searchParams = new URLSearchParams()
  if (params.includeVacancies !== undefined) {
    searchParams.set('includeVacancies', String(params.includeVacancies))
  }

  const queryString = searchParams.toString()
  const url = `/v1/hackathons/${hackathonId}/teams/${teamId}${queryString ? `?${queryString}` : ''}`

  return platformFetchJson<GetTeamResponse>(url, {
    method: 'GET',
  })
}
