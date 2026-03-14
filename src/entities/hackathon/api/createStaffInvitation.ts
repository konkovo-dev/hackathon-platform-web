import { platformFetchJson } from '@/shared/api/platformClient'
import type { HackathonRole } from './listHackathonStaff'

export type CreateStaffInvitationRequest = {
  idempotencyKey: string
  targetUserId: string
  requestedRole: HackathonRole
  message?: string
}

export type CreateStaffInvitationResponse = {
  invitationId: string
}

export async function createStaffInvitation(
  hackathonId: string,
  request: CreateStaffInvitationRequest
): Promise<CreateStaffInvitationResponse> {
  return platformFetchJson<CreateStaffInvitationResponse>(
    `/v1/hackathons/${hackathonId}/staff-invitations`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
