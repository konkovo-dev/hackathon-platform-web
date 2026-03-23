import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type CreateTeamInvitationRequest =
  operations['TeamInboxService_CreateTeamInvitation']['requestBody']['content']['application/json']

export type CreateTeamInvitationResponse =
  operations['TeamInboxService_CreateTeamInvitation']['responses']['200']['content']['application/json']

export async function createTeamInvitation(
  hackathonId: string,
  teamId: string,
  request: CreateTeamInvitationRequest
): Promise<CreateTeamInvitationResponse> {
  return platformFetchJson<CreateTeamInvitationResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/team-invitations`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
