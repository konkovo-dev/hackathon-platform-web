import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type ListTeamMembersResponse =
  operations['TeamMembersService_ListTeamMembers']['responses']['200']['content']['application/json']

export async function listTeamMembers(
  hackathonId: string,
  teamId: string
): Promise<ListTeamMembersResponse> {
  return platformFetchJson<ListTeamMembersResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/members`,
    {
      method: 'GET',
    }
  )
}
