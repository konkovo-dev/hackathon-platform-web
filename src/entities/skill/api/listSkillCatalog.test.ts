import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listSkillCatalog } from './listSkillCatalog'

vi.mock('@/shared/api/platformClient', () => ({
  platformFetchJson: vi.fn(),
}))

import { platformFetchJson } from '@/shared/api/platformClient'

describe('listSkillCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch skill catalog with default params', async () => {
    const mockResponse = {
      skills: [
        { id: 'skill-1', name: 'React' },
        { id: 'skill-2', name: 'TypeScript' },
      ],
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await listSkillCatalog()

    expect(platformFetchJson).toHaveBeenCalledWith('/v1/skills/list', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    expect(result).toEqual(mockResponse)
  })

  it('should fetch skill catalog with pagination', async () => {
    const params = {
      query: {
        page: {
          pageSize: 50,
          pageNumber: 1,
        },
      },
    }

    const mockResponse = {
      skills: [
        { id: 'skill-1', name: 'React' },
        { id: 'skill-2', name: 'TypeScript' },
      ],
      total: 100,
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await listSkillCatalog(params)

    expect(platformFetchJson).toHaveBeenCalledWith('/v1/skills/list', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    expect(result).toEqual(mockResponse)
  })

  it('should fetch skill catalog with search query', async () => {
    const params = {
      query: {
        search: 'react',
        page: {
          pageSize: 20,
        },
      },
    }

    const mockResponse = {
      skills: [
        { id: 'skill-1', name: 'React' },
        { id: 'skill-100', name: 'React Native' },
      ],
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await listSkillCatalog(params)

    expect(platformFetchJson).toHaveBeenCalledWith('/v1/skills/list', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    expect(result.skills).toHaveLength(2)
  })

  it('should handle empty catalog response', async () => {
    const mockResponse = {
      skills: [],
      total: 0,
    }

    vi.mocked(platformFetchJson).mockResolvedValue(mockResponse)

    const result = await listSkillCatalog()

    expect(result.skills).toEqual([])
  })

  it('should handle API errors', async () => {
    vi.mocked(platformFetchJson).mockRejectedValue(new Error('API Error'))

    await expect(listSkillCatalog()).rejects.toThrow('API Error')
  })
})
