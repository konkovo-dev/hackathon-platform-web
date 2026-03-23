import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type DeleteTeamResponse =
  operations['TeamService_DeleteTeam']['responses']['200']['content']['application/json']

export async function deleteTeam(
  hackathonId: string,
  teamId: string,
  idempotencyKey?: string
): Promise<DeleteTeamResponse> {
  const searchParams = new URLSearchParams()
  if (idempotencyKey) {
    searchParams.set('idempotencyKey.key', idempotencyKey)
  }

  const queryString = searchParams.toString()
  const url = `/v1/hackathons/${hackathonId}/teams/${teamId}${queryString ? `?${queryString}` : ''}`

  return platformFetchJson<DeleteTeamResponse>(url, {
    method: 'DELETE',
  })
}
