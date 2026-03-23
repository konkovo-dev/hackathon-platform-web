import type { JoinRequest } from './types'

export function isPendingJoinRequest(request: JoinRequest): boolean {
  return request.status === 'TEAM_INBOX_PENDING'
}

export function countPendingJoinRequests(requests: JoinRequest[] | undefined): number {
  if (!requests?.length) return 0
  return requests.filter(isPendingJoinRequest).length
}
