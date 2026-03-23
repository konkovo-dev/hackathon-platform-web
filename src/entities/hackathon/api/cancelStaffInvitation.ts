import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type CancelStaffInvitationResponse =
  operations['StaffService_CancelStaffInvitation']['responses']['200']['content']['application/json']

export type CancelStaffInvitationRequest =
  operations['StaffService_CancelStaffInvitation']['requestBody']['content']['application/json']

export async function cancelStaffInvitation(
  hackathonId: string,
  invitationId: string,
  body?: CancelStaffInvitationRequest
): Promise<CancelStaffInvitationResponse> {
  return platformFetchJson<CancelStaffInvitationResponse>(
    `/v1/hackathons/${hackathonId}/staff-invitations/${invitationId}/cancel`,
    {
      method: 'POST',
      body: JSON.stringify(body ?? { idempotencyKey: { key: crypto.randomUUID() } }),
    }
  )
}
