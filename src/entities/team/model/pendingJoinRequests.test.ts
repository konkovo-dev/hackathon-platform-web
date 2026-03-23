import { describe, expect, it } from 'vitest'
import { countPendingJoinRequests, isPendingJoinRequest } from './pendingJoinRequests'
import type { JoinRequest } from './types'

describe('pendingJoinRequests', () => {
  it('isPendingJoinRequest is true only for TEAM_INBOX_PENDING', () => {
    expect(isPendingJoinRequest({ status: 'TEAM_INBOX_PENDING' } as JoinRequest)).toBe(true)
    expect(isPendingJoinRequest({ status: 'TEAM_INBOX_DECLINED' } as JoinRequest)).toBe(false)
    expect(isPendingJoinRequest({ status: 'TEAM_INBOX_ACCEPTED' } as JoinRequest)).toBe(false)
    expect(isPendingJoinRequest({} as JoinRequest)).toBe(false)
  })

  it('countPendingJoinRequests ignores non-pending', () => {
    const requests = [
      { status: 'TEAM_INBOX_PENDING' },
      { status: 'TEAM_INBOX_DECLINED' },
      { status: 'TEAM_INBOX_PENDING' },
    ] as JoinRequest[]
    expect(countPendingJoinRequests(requests)).toBe(2)
    expect(countPendingJoinRequests(undefined)).toBe(0)
    expect(countPendingJoinRequests([])).toBe(0)
  })
})
