import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSkillCatalogQuery } from './hooks'
import { listSkillCatalog } from '../api/listSkillCatalog'
import { type ReactNode, createElement } from 'react'

vi.mock('../api/listSkillCatalog', () => ({
  listSkillCatalog: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useSkillCatalogQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch skill catalog successfully', async () => {
    const mockResponse = {
      skills: [
        { id: 'skill-1', name: 'React' },
        { id: 'skill-2', name: 'TypeScript' },
        { id: 'skill-3', name: 'Node.js' },
      ],
    }

    vi.mocked(listSkillCatalog).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useSkillCatalogQuery(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(listSkillCatalog).toHaveBeenCalledWith({ query: { page: { pageSize: 100 } } })
    expect(result.current.data).toEqual(mockResponse)
  })

  it('should use staleTime of 1 hour', async () => {
    const mockResponse = {
      skills: [{ id: 'skill-1', name: 'React' }],
    }

    vi.mocked(listSkillCatalog).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useSkillCatalogQuery(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.isStale).toBe(false)
  })

  it('should handle empty catalog', async () => {
    const mockResponse = {
      skills: [],
    }

    vi.mocked(listSkillCatalog).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useSkillCatalogQuery(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.skills).toEqual([])
  })

  it('should handle fetch errors', async () => {
    vi.mocked(listSkillCatalog).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useSkillCatalogQuery(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeDefined()
  })

  it('should fetch 100 skills by default', async () => {
    const mockResponse = {
      skills: Array.from({ length: 100 }, (_, i) => ({
        id: `skill-${i}`,
        name: `Skill ${i}`,
      })),
    }

    vi.mocked(listSkillCatalog).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useSkillCatalogQuery(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.skills).toHaveLength(100)
  })
})
