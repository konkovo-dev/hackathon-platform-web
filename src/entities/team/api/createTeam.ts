import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type CreateTeamRequest =
  operations['TeamService_CreateTeam']['requestBody']['content']['application/json']

export type CreateTeamResponse =
  operations['TeamService_CreateTeam']['responses']['200']['content']['application/json']

export async function createTeam(
  hackathonId: string,
  request: CreateTeamRequest
): Promise<CreateTeamResponse> {
  return platformFetchJson<CreateTeamResponse>(`/v1/hackathons/${hackathonId}/teams`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
