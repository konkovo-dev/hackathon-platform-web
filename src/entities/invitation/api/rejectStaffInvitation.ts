import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type RejectStaffInvitationResponse =
  operations['StaffService_RejectStaffInvitation']['responses']['200']['content']['application/json']

export async function rejectStaffInvitation(
  invitationId: string
): Promise<RejectStaffInvitationResponse> {
  return platformFetchJson<RejectStaffInvitationResponse>(
    `/v1/users/me/staff-invitations/${invitationId}/reject`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  )
}
