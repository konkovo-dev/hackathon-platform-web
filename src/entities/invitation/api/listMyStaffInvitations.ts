import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type ListMyStaffInvitationsResponse =
  operations['StaffService_ListMyStaffInvitations']['responses']['200']['content']['application/json']

export async function listMyStaffInvitations(): Promise<ListMyStaffInvitationsResponse> {
  return platformFetchJson<ListMyStaffInvitationsResponse>(
    '/v1/users/me/staff-invitations/list',
    {
      method: 'POST',
      body: JSON.stringify({ query: {} }),
    }
  )
}
