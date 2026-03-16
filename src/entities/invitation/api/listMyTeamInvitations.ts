import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type ListMyTeamInvitationsResponse =
  operations['TeamInboxService_ListMyTeamInvitations']['responses']['200']['content']['application/json']

export async function listMyTeamInvitations(): Promise<ListMyTeamInvitationsResponse> {
  return platformFetchJson<ListMyTeamInvitationsResponse>(
    '/v1/users/me/team-invitations/list',
    {
      method: 'POST',
      body: JSON.stringify({ query: {} }),
    }
  )
}
