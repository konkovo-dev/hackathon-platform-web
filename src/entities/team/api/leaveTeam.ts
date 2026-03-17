import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type LeaveTeamResponse =
  operations['TeamMembersService_LeaveTeam']['responses']['200']['content']['application/json']

export async function leaveTeam(
  hackathonId: string,
  teamId: string
): Promise<LeaveTeamResponse> {
  return platformFetchJson<LeaveTeamResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/members/leave`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  )
}
