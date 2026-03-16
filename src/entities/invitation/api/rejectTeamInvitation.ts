import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type RejectTeamInvitationResponse =
  operations['TeamInboxService_RejectTeamInvitation']['responses']['200']['content']['application/json']

export async function rejectTeamInvitation(
  invitationId: string
): Promise<RejectTeamInvitationResponse> {
  return platformFetchJson<RejectTeamInvitationResponse>(
    `/v1/users/me/team-invitations/${invitationId}/reject`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  )
}
