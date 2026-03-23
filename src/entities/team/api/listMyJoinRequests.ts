import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type ListMyJoinRequestsRequest =
  operations['TeamInboxService_ListMyJoinRequests']['requestBody']['content']['application/json']

export type ListMyJoinRequestsResponse =
  operations['TeamInboxService_ListMyJoinRequests']['responses']['200']['content']['application/json']

export async function listMyJoinRequests(
  request: ListMyJoinRequestsRequest = {}
): Promise<ListMyJoinRequestsResponse> {
  return platformFetchJson<ListMyJoinRequestsResponse>('/v1/users/me/join-requests/list', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
