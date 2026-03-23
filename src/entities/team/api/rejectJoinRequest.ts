import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type RejectJoinRequestResponse =
  operations['TeamInboxService_RejectJoinRequest']['responses']['200']['content']['application/json']

export async function rejectJoinRequest(
  hackathonId: string,
  teamId: string,
  requestId: string
): Promise<RejectJoinRequestResponse> {
  return platformFetchJson<RejectJoinRequestResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/join-requests/${requestId}/reject`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  )
}
