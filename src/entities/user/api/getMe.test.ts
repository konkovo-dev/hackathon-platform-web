import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getMe, getUserDisplayName } from './getMe'
import type { MeProfile } from '../model/types'

// Мокаем platformFetchJson
vi.mock('@/shared/api/platformClient', () => ({
  platformFetchJson: vi.fn(),
}))

import { platformFetchJson } from '@/shared/api/platformClient'

describe('getMe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch and normalize user profile', async () => {
    const mockResponse = {
      user: {
        userId: 'user-1',
        username: 'testuser',
        firstName: 'Иван',
        lastName: 'Иванов',
      },
      skills: [
        { catalog: { id: '1', name: 'React' }, custom: undefined },
        { catalog: { id: '2', name: 'TypeScript' }, custom: undefined },
      ],
      contacts: [
        {
          contact: { type: 'CONTACT_TYPE_EMAIL', value: 'test@example.com' },
          visibility: 'VISIBILITY_LEVEL_PUBLIC',
        },
      ],
      visibility: {
        skills: 'VISIBILITY_LEVEL_PUBLIC',
        contacts: 'VISIBILITY_LEVEL_PUBLIC',
      },
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await getMe()

    expect(platformFetchJson).toHaveBeenCalledWith('/v1/users/me', { method: 'GET' })
    expect(result).toEqual({
      user: mockResponse.user,
      skills: mockResponse.skills,
      contacts: mockResponse.contacts,
      visibility: {
        skills: 'VISIBILITY_LEVEL_PUBLIC',
        contacts: 'VISIBILITY_LEVEL_PUBLIC',
      },
    })
  })

  it('should handle null skills', async () => {
    vi.mocked(platformFetchJson).mockResolvedValue({
      user: { userId: '1', username: 'test' },
      skills: undefined,
      contacts: [],
      visibility: {},
    })

    const result = await getMe()
    expect(result.skills).toEqual([])
  })

  it('should handle null contacts', async () => {
    vi.mocked(platformFetchJson).mockResolvedValue({
      user: { userId: '1', username: 'test' },
      skills: [],
      contacts: undefined,
      visibility: {},
    })

    const result = await getMe()
    expect(result.contacts).toEqual([])
  })

  it('should use default visibility when not provided', async () => {
    vi.mocked(platformFetchJson).mockResolvedValue({
      user: { userId: '1', username: 'test' },
      skills: [],
      contacts: [],
      visibility: {},
    })

    const result = await getMe()
    expect(result.visibility).toEqual({
      skills: 'VISIBILITY_LEVEL_PUBLIC',
      contacts: 'VISIBILITY_LEVEL_PUBLIC',
    })
  })

  it('should map avatar_url from API to avatarUrl on user', async () => {
    vi.mocked(platformFetchJson).mockResolvedValue({
      user: {
        userId: '1',
        username: 'u',
        firstName: 'A',
        lastName: 'B',
        avatar_url: 'https://cdn.example.com/a.jpg',
      },
      skills: [],
      contacts: [],
      visibility: {},
    })

    const result = await getMe()
    expect(result.user?.avatarUrl).toBe('https://cdn.example.com/a.jpg')
  })
})

describe('getUserDisplayName', () => {
  it('should return full name when both firstName and lastName present', () => {
    const me: MeProfile = {
      user: { userId: '1', username: 'test', firstName: 'Иван', lastName: 'Иванов' },
      skills: [],
      contacts: [],
      visibility: { skills: 'VISIBILITY_LEVEL_PUBLIC', contacts: 'VISIBILITY_LEVEL_PUBLIC' },
    }
    expect(getUserDisplayName(me)).toBe('Иван Иванов')
  })

  it('should return firstName when lastName is missing', () => {
    const me: MeProfile = {
      user: { userId: '1', username: 'test', firstName: 'Иван', lastName: undefined },
      skills: [],
      contacts: [],
      visibility: { skills: 'VISIBILITY_LEVEL_PUBLIC', contacts: 'VISIBILITY_LEVEL_PUBLIC' },
    }
    expect(getUserDisplayName(me)).toBe('Иван')
  })

  it('should return username when name is missing', () => {
    const me: MeProfile = {
      user: { userId: '1', username: 'testuser', firstName: undefined, lastName: undefined },
      skills: [],
      contacts: [],
      visibility: { skills: 'VISIBILITY_LEVEL_PUBLIC', contacts: 'VISIBILITY_LEVEL_PUBLIC' },
    }
    expect(getUserDisplayName(me)).toBe('testuser')
  })

  it('should return userId when username is missing', () => {
    const me: MeProfile = {
      user: { userId: 'user-123', username: undefined, firstName: undefined, lastName: undefined },
      skills: [],
      contacts: [],
      visibility: { skills: 'VISIBILITY_LEVEL_PUBLIC', contacts: 'VISIBILITY_LEVEL_PUBLIC' },
    }
    expect(getUserDisplayName(me)).toBe('user-123')
  })

  it('should return fallbackUserId when everything is missing', () => {
    expect(getUserDisplayName(null, 'fallback-id')).toBe('fallback-id')
  })

  it('should return — when nothing is provided', () => {
    expect(getUserDisplayName(null)).toBe('—')
  })
})
