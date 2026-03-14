import { platformFetchJson } from '@/shared/api/platformClient'

export type User = {
  userId: string
  firstName?: string
  lastName?: string
  email?: string
  avatarUrl?: string
}

export type ListUsersRequest = {
  query?: {
    q?: string
    page?: {
      pageSize?: number
      pageToken?: string
    }
  }
}

export type ListUsersResponse = {
  users: User[]
  page?: {
    hasMore: boolean
    nextPageToken: string
  }
}

export async function listUsers(request: ListUsersRequest = {}): Promise<ListUsersResponse> {
  return platformFetchJson<ListUsersResponse>('/v1/users/list', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
