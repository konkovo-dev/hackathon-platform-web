import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateMe } from './updateMe'

vi.mock('@/shared/api/platformClient', () => ({
  platformFetchJson: vi.fn(),
}))

import { platformFetchJson } from '@/shared/api/platformClient'

describe('updateMe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should send PUT request with user data', async () => {
    const input = {
      firstName: 'Пётр',
      lastName: 'Петров',
      timezone: 'Europe/Moscow',
    }

    const mockResponse = { success: true }
    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    await updateMe(input)

    expect(platformFetchJson).toHaveBeenCalledWith('/v1/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
  })

  it('should handle avatarUrl update', async () => {
    const input = {
      avatarUrl: 'https://example.com/avatar.jpg',
    }

    vi.mocked(platformFetchJson).mockResolvedValue({})

    await updateMe(input)

    expect(platformFetchJson).toHaveBeenCalledWith(
      '/v1/users/me',
      expect.objectContaining({
        body: JSON.stringify(input),
      })
    )
  })
})
