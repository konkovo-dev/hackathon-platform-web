import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateMyContacts } from './updateMyContacts'

vi.mock('@/shared/api/platformClient', () => ({
  platformFetchJson: vi.fn(),
}))

import { platformFetchJson } from '@/shared/api/platformClient'

describe('updateMyContacts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should successfully update contacts with email', async () => {
    const input = {
      contacts: [
        {
          contact: { type: 'CONTACT_TYPE_EMAIL' as const, value: 'test@example.com' },
          visibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
        },
      ],
      contactsVisibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
    }

    const mockResponse = {
      contacts: input.contacts,
      visibility: { contactsVisibility: input.contactsVisibility },
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await updateMyContacts(input)

    expect(platformFetchJson).toHaveBeenCalledWith('/v1/users/me/contacts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    expect(result).toEqual(mockResponse)
  })

  it('should successfully update multiple contacts', async () => {
    const input = {
      contacts: [
        {
          contact: { type: 'CONTACT_TYPE_EMAIL' as const, value: 'test@example.com' },
          visibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
        },
        {
          contact: { type: 'CONTACT_TYPE_GITHUB' as const, value: 'testuser' },
          visibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
        },
        {
          contact: { type: 'CONTACT_TYPE_TELEGRAM' as const, value: '@testuser' },
          visibility: 'VISIBILITY_LEVEL_TEAM' as const,
        },
        {
          contact: { type: 'CONTACT_TYPE_LINKEDIN' as const, value: 'testuser' },
          visibility: 'VISIBILITY_LEVEL_PRIVATE' as const,
        },
      ],
      contactsVisibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
    }

    const mockResponse = {
      contacts: input.contacts,
      visibility: { contactsVisibility: input.contactsVisibility },
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await updateMyContacts(input)

    expect(result.contacts).toHaveLength(4)
  })

  it('should successfully update contacts visibility to private', async () => {
    const input = {
      contacts: [
        {
          contact: { type: 'CONTACT_TYPE_EMAIL' as const, value: 'private@example.com' },
          visibility: 'VISIBILITY_LEVEL_PRIVATE' as const,
        },
      ],
      contactsVisibility: 'VISIBILITY_LEVEL_PRIVATE' as const,
    }

    const mockResponse = {
      contacts: input.contacts,
      visibility: { contactsVisibility: 'VISIBILITY_LEVEL_PRIVATE' },
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await updateMyContacts(input)

    expect(result.visibility.contactsVisibility).toBe('VISIBILITY_LEVEL_PRIVATE')
  })

  it('should successfully clear all contacts', async () => {
    const input = {
      contacts: [],
      contactsVisibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
    }

    const mockResponse = {
      contacts: [],
      visibility: { contactsVisibility: input.contactsVisibility },
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await updateMyContacts(input)

    expect(result.contacts).toEqual([])
  })

  it('should handle per-contact visibility settings', async () => {
    const input = {
      contacts: [
        {
          contact: { type: 'CONTACT_TYPE_EMAIL' as const, value: 'public@example.com' },
          visibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
        },
        {
          contact: { type: 'CONTACT_TYPE_GITHUB' as const, value: 'testuser' },
          visibility: 'VISIBILITY_LEVEL_TEAM' as const,
        },
        {
          contact: { type: 'CONTACT_TYPE_TELEGRAM' as const, value: '@testuser' },
          visibility: 'VISIBILITY_LEVEL_PRIVATE' as const,
        },
      ],
      contactsVisibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
    }

    const mockResponse = {
      contacts: input.contacts,
      visibility: { contactsVisibility: input.contactsVisibility },
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await updateMyContacts(input)

    expect(result.contacts[0].visibility).toBe('VISIBILITY_LEVEL_PUBLIC')
    expect(result.contacts[1].visibility).toBe('VISIBILITY_LEVEL_TEAM')
    expect(result.contacts[2].visibility).toBe('VISIBILITY_LEVEL_PRIVATE')
  })

  it('should handle API errors', async () => {
    const input = {
      contacts: [],
      contactsVisibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
    }

    vi.mocked(platformFetchJson).mockRejectedValue(new Error('API Error'))

    await expect(updateMyContacts(input)).rejects.toThrow('API Error')
  })

  it('should use camelCase field names in request body', async () => {
    const input = {
      contacts: [
        {
          contact: { type: 'CONTACT_TYPE_EMAIL' as const, value: 'test@example.com' },
          visibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
        },
      ],
      contactsVisibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
    }

    vi.mocked(platformFetchJson).mockResolvedValue({ contacts: [], visibility: {} })

    await updateMyContacts(input)

    const callArgs = vi.mocked(platformFetchJson).mock.calls[0]
    const requestBody = JSON.parse(callArgs[1]?.body as string)

    expect(requestBody).toHaveProperty('contacts')
    expect(requestBody).toHaveProperty('contactsVisibility')
  })
})
