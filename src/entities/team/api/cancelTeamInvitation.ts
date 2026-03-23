import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type CancelTeamInvitationResponse =
  operations['TeamInboxService_CancelTeamInvitation']['responses']['200']['content']['application/json']

export async function cancelTeamInvitation(
  hackathonId: string,
  teamId: string,
  invitationId: string
): Promise<CancelTeamInvitationResponse> {
  return platformFetchJson<CancelTeamInvitationResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/team-invitations/${invitationId}/cancel`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  )
}
