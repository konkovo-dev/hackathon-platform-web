import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type AcceptStaffInvitationResponse =
  operations['StaffService_AcceptStaffInvitation']['responses']['200']['content']['application/json']

export async function acceptStaffInvitation(
  invitationId: string
): Promise<AcceptStaffInvitationResponse> {
  return platformFetchJson<AcceptStaffInvitationResponse>(
    `/v1/users/me/staff-invitations/${invitationId}/accept`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  )
}
