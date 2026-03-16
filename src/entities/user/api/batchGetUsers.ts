import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations, components } from '@/shared/api/platform.schema'

export type BatchGetUsersRequest =
  operations['UsersService_BatchGetUsers']['requestBody']['content']['application/json']

export type BatchGetUsersResponse =
  operations['UsersService_BatchGetUsers']['responses']['200']['content']['application/json']

export type User = components['schemas']['v1User']

export async function batchGetUsers(
  request: BatchGetUsersRequest
): Promise<BatchGetUsersResponse> {
  return platformFetchJson<BatchGetUsersResponse>('/v1/users/batchGet', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
