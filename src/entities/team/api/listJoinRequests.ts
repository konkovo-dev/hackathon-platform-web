import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type ListJoinRequestsRequest =
  operations['TeamInboxService_ListJoinRequests']['requestBody']['content']['application/json']

export type ListJoinRequestsResponse =
  operations['TeamInboxService_ListJoinRequests']['responses']['200']['content']['application/json']

export async function listJoinRequests(
  hackathonId: string,
  teamId: string,
  request: ListJoinRequestsRequest = {}
): Promise<ListJoinRequestsResponse> {
  return platformFetchJson<ListJoinRequestsResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/join-requests/list`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
