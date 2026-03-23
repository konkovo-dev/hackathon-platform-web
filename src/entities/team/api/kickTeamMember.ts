import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type KickTeamMemberResponse =
  operations['TeamMembersService_KickTeamMember']['responses']['200']['content']['application/json']

export async function kickTeamMember(
  hackathonId: string,
  teamId: string,
  userId: string
): Promise<KickTeamMemberResponse> {
  return platformFetchJson<KickTeamMemberResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/members/${userId}/kick`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  )
}
