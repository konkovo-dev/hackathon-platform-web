import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type AcceptJoinRequestResponse =
  operations['TeamInboxService_AcceptJoinRequest']['responses']['200']['content']['application/json']

export async function acceptJoinRequest(
  hackathonId: string,
  teamId: string,
  requestId: string
): Promise<AcceptJoinRequestResponse> {
  return platformFetchJson<AcceptJoinRequestResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/join-requests/${requestId}/accept`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  )
}
