import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateMySkills } from './updateMySkills'

vi.mock('@/shared/api/platformClient', () => ({
  platformFetchJson: vi.fn(),
}))

import { platformFetchJson } from '@/shared/api/platformClient'

describe('updateMySkills', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should successfully update skills with catalog skills', async () => {
    const input = {
      userSkills: [
        { catalog: { id: 'skill-1', name: 'React' }, custom: null },
        { catalog: { id: 'skill-2', name: 'TypeScript' }, custom: null },
      ],
      catalogSkillIds: ['skill-1', 'skill-2'],
      skillsVisibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
    }

    const mockResponse = {
      skills: input.userSkills,
      visibility: { skillsVisibility: input.skillsVisibility },
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await updateMySkills(input)

    expect(platformFetchJson).toHaveBeenCalledWith('/v1/users/me/skills', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    expect(result).toEqual(mockResponse)
  })

  it('should successfully update skills with custom skills', async () => {
    const input = {
      userSkills: [
        { catalog: null, custom: { id: 'custom-1', name: 'My Custom Skill' } },
      ],
      catalogSkillIds: [],
      skillsVisibility: 'VISIBILITY_LEVEL_TEAM' as const,
    }

    const mockResponse = {
      skills: input.userSkills,
      visibility: { skillsVisibility: input.skillsVisibility },
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await updateMySkills(input)

    expect(platformFetchJson).toHaveBeenCalledWith('/v1/users/me/skills', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    expect(result).toEqual(mockResponse)
  })

  it('should successfully update skills visibility to private', async () => {
    const input = {
      userSkills: [],
      catalogSkillIds: [],
      skillsVisibility: 'VISIBILITY_LEVEL_PRIVATE' as const,
    }

    const mockResponse = {
      skills: [],
      visibility: { skillsVisibility: 'VISIBILITY_LEVEL_PRIVATE' },
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await updateMySkills(input)

    expect(result.visibility.skillsVisibility).toBe('VISIBILITY_LEVEL_PRIVATE')
  })

  it('should successfully clear all skills', async () => {
    const input = {
      userSkills: [],
      catalogSkillIds: [],
      skillsVisibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
    }

    const mockResponse = {
      skills: [],
      visibility: { skillsVisibility: input.skillsVisibility },
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await updateMySkills(input)

    expect(result.skills).toEqual([])
  })

  it('should handle mixed catalog and custom skills', async () => {
    const input = {
      userSkills: [
        { catalog: { id: 'skill-1', name: 'React' }, custom: null },
        { catalog: null, custom: { id: 'custom-1', name: 'My Custom Skill' } },
        { catalog: { id: 'skill-2', name: 'TypeScript' }, custom: null },
      ],
      catalogSkillIds: ['skill-1', 'skill-2'],
      skillsVisibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
    }

    const mockResponse = {
      skills: input.userSkills,
      visibility: { skillsVisibility: input.skillsVisibility },
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await updateMySkills(input)

    expect(result.skills).toHaveLength(3)
  })

  it('should handle API errors', async () => {
    const input = {
      userSkills: [],
      catalogSkillIds: [],
      skillsVisibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
    }

    vi.mocked(platformFetchJson).mockRejectedValue(new Error('API Error'))

    await expect(updateMySkills(input)).rejects.toThrow('API Error')
  })

  it('should use camelCase field names in request body', async () => {
    const input = {
      userSkills: [{ catalog: { id: 'skill-1', name: 'React' }, custom: null }],
      catalogSkillIds: ['skill-1'],
      skillsVisibility: 'VISIBILITY_LEVEL_PUBLIC' as const,
    }

    vi.mocked(platformFetchJson).mockResolvedValue({ skills: [], visibility: {} })

    await updateMySkills(input)

    const callArgs = vi.mocked(platformFetchJson).mock.calls[0]
    const requestBody = JSON.parse(callArgs[1]?.body as string)

    expect(requestBody).toHaveProperty('userSkills')
    expect(requestBody).toHaveProperty('catalogSkillIds')
    expect(requestBody).toHaveProperty('skillsVisibility')
  })
})
