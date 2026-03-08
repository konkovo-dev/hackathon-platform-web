import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProfileQuery, useUpdateProfileMutation, profileQueryKey } from './hooks'
import { type ReactNode, createElement } from 'react'

// Мокаем API функции
vi.mock('@/entities/user/api/getMe', () => ({
  getMe: vi.fn(),
}))

vi.mock('@/entities/user/api/updateMe', () => ({
  updateMe: vi.fn(),
}))

import { getMe } from '@/entities/user/api/getMe'
import { updateMe } from '@/entities/user/api/updateMe'
import type { MeProfile } from '@/entities/user/model/types'

const mockProfile: MeProfile = {
  user: {
    userId: 'user-1',
    username: 'testuser',
    firstName: 'Иван',
    lastName: 'Иванов',
  },
  skills: [],
  contacts: [],
  visibility: {
    skills: 'VISIBILITY_LEVEL_PUBLIC',
    contacts: 'VISIBILITY_LEVEL_PUBLIC',
  },
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useProfileQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch profile data', async () => {
    vi.mocked(getMe).mockResolvedValue(mockProfile)

    const { result } = renderHook(() => useProfileQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockProfile)
    expect(getMe).toHaveBeenCalledTimes(1)
  })

  it('should use initial data when provided', () => {
    const { result } = renderHook(() => useProfileQuery(mockProfile), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toEqual(mockProfile)
    expect(getMe).not.toHaveBeenCalled()
  })

  it('should handle fetch error', async () => {
    vi.mocked(getMe).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useProfileQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
  })
})

describe('useUpdateProfileMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should update profile', async () => {
    vi.mocked(updateMe).mockResolvedValue({})

    const { result } = renderHook(() => useUpdateProfileMutation(), {
      wrapper: createWrapper(),
    })

    const input = { firstName: 'Пётр', lastName: 'Петров' }
    result.current.mutate(input)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(updateMe).toHaveBeenCalledWith(input)
  })

  it('should handle update error', async () => {
    vi.mocked(updateMe).mockRejectedValue(new Error('Update failed'))

    const { result } = renderHook(() => useUpdateProfileMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ firstName: 'Пётр' })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
  })
})
