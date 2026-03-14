import { platformFetchJson } from '@/shared/api/platformClient'
import type { User } from './listUsers'

export type BatchGetUsersRequest = {
  userIds: string[]
}

export type BatchGetUsersResponse = {
  users: User[]
}

export async function batchGetUsers(
  request: BatchGetUsersRequest
): Promise<BatchGetUsersResponse> {
  return platformFetchJson<BatchGetUsersResponse>('/v1/users/batchGet', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
