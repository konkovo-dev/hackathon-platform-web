import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type ListHackathonStaffInvitationsResponse =
  operations['StaffService_ListHackathonStaffInvitations']['responses']['200']['content']['application/json']

export async function listHackathonStaffInvitations(
  hackathonId: string
): Promise<ListHackathonStaffInvitationsResponse> {
  return platformFetchJson<ListHackathonStaffInvitationsResponse>(
    `/v1/hackathons/${hackathonId}/staff-invitations`,
    { method: 'GET' }
  )
}
