import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach } from 'vitest'
import { createElement, type ReactNode } from 'react'
import { useInfiniteHackathonListQuery } from './hooks'
import type { HackathonListFilters } from '@/entities/hackathon/model/types'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  const Wrapper = ({ children }: { children: ReactNode }) => {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
  Wrapper.displayName = 'TestWrapper'
  return Wrapper
}

describe('useInfiniteHackathonListQuery', () => {
  let filters: HackathonListFilters

  beforeEach(() => {
    filters = {
      stage: 'all',
      formats: [],
      sortDirection: 'asc',
    }
  })

  it('загружает первую страницу', async () => {
    const { result } = renderHook(() => useInfiniteHackathonListQuery(filters), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(1))
    expect(result.current.data?.pages[0].hackathons).toBeDefined()
  })

  it('загружает следующую страницу при вызове fetchNextPage', async () => {
    const { result } = renderHook(() => useInfiniteHackathonListQuery(filters), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(1))

    if (result.current.hasNextPage) {
      result.current.fetchNextPage()

      await waitFor(() => expect(result.current.data?.pages).toHaveLength(2))
    }
  })

  it('объединяет все страницы в один список', async () => {
    const { result } = renderHook(() => useInfiniteHackathonListQuery(filters), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(1))

    const allHackathons = result.current.data?.pages.flatMap(page => page.hackathons) ?? []
    expect(allHackathons.length).toBeGreaterThan(0)
  })

  it('использует initialData для SSR', async () => {
    const initialData = {
      hackathons: [
        {
          hackathonId: 'test-1',
          name: 'Test Hackathon',
          location: { online: true },
          dates: {},
          limits: {},
          registrationPolicy: { allowIndividual: true, allowTeam: true },
          stage: 'REGISTRATION' as const,
          state: 'PUBLISHED' as const,
        },
      ],
      page: {
        hasMore: true,
        nextPageToken: 'token-1',
      },
    }

    const { result } = renderHook(() => useInfiniteHackathonListQuery(filters, initialData), {
      wrapper: createWrapper(),
    })

    expect(result.current.data?.pages).toHaveLength(1)
    expect(result.current.data?.pages[0].hackathons[0].hackathonId).toBe('test-1')
  })

  it('правильно обрабатывает отсутствие следующей страницы', async () => {
    const { result } = renderHook(() => useInfiniteHackathonListQuery(filters), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(1))

    if (!result.current.data?.pages[0].page.hasMore) {
      expect(result.current.hasNextPage).toBe(false)
    }
  })
})
