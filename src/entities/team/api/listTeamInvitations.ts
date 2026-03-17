import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type ListTeamInvitationsRequest =
  operations['TeamInboxService_ListTeamInvitations']['requestBody']['content']['application/json']

export type ListTeamInvitationsResponse =
  operations['TeamInboxService_ListTeamInvitations']['responses']['200']['content']['application/json']

export async function listTeamInvitations(
  hackathonId: string,
  teamId: string,
  request: ListTeamInvitationsRequest = {}
): Promise<ListTeamInvitationsResponse> {
  return platformFetchJson<ListTeamInvitationsResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/team-invitations/list`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
