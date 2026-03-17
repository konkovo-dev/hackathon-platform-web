import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type CreateJoinRequestRequest =
  operations['TeamInboxService_CreateJoinRequest']['requestBody']['content']['application/json']

export type CreateJoinRequestResponse =
  operations['TeamInboxService_CreateJoinRequest']['responses']['200']['content']['application/json']

export async function createJoinRequest(
  hackathonId: string,
  teamId: string,
  request: CreateJoinRequestRequest
): Promise<CreateJoinRequestResponse> {
  return platformFetchJson<CreateJoinRequestResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/join-requests`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
