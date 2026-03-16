import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations, components } from '@/shared/api/platform.schema'

export type User = components['schemas']['v1User']

export type ListUsersRequest =
  operations['UsersService_ListUsers']['requestBody']['content']['application/json']

export type ListUsersResponse =
  operations['UsersService_ListUsers']['responses']['200']['content']['application/json']

export async function listUsers(request: ListUsersRequest = {}): Promise<ListUsersResponse> {
  return platformFetchJson<ListUsersResponse>('/v1/users/list', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
