import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'
import type { HackathonRole } from './listHackathonStaff'

export type CreateStaffInvitationRequest =
  operations['StaffService_CreateStaffInvitation']['requestBody']['content']['application/json']

export type CreateStaffInvitationResponse =
  operations['StaffService_CreateStaffInvitation']['responses']['200']['content']['application/json']

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

export type { HackathonRole }
