import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type AcceptTeamInvitationResponse =
  operations['TeamInboxService_AcceptTeamInvitation']['responses']['200']['content']['application/json']

export async function acceptTeamInvitation(
  invitationId: string
): Promise<AcceptTeamInvitationResponse> {
  return platformFetchJson<AcceptTeamInvitationResponse>(
    `/v1/users/me/team-invitations/${invitationId}/accept`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  )
}
