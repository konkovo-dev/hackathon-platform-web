import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type UpdateTeamRequest =
  operations['TeamService_UpdateTeam']['requestBody']['content']['application/json']

export type UpdateTeamResponse =
  operations['TeamService_UpdateTeam']['responses']['200']['content']['application/json']

export async function updateTeam(
  hackathonId: string,
  teamId: string,
  request: UpdateTeamRequest
): Promise<UpdateTeamResponse> {
  return platformFetchJson<UpdateTeamResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    }
  )
}
