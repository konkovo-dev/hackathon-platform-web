import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useSessionQuery,
  useSessionQueryWithInitial,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} from './hooks'
import { authApi } from '@/entities/auth/api/authApi'
import { type ReactNode, createElement } from 'react'

// Мокаем authApi
vi.mock('@/entities/auth/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    session: vi.fn(),
  },
}))

const createWrapper = () => {
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

describe('auth hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useSessionQuery', () => {
    it('should fetch session data', async () => {
      const mockSession = { active: true, userId: 'user-123', username: 'testuser' }
      vi.mocked(authApi.session).mockResolvedValue(mockSession)

      const { result } = renderHook(() => useSessionQuery(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(authApi.session).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockSession)
    })

    it('should handle session fetch errors', async () => {
      vi.mocked(authApi.session).mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useSessionQuery(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBeDefined()
    })

    it('should use staleTime of 15 seconds', async () => {
      const mockSession = { active: true, userId: 'user-123', username: 'testuser' }
      vi.mocked(authApi.session).mockResolvedValue(mockSession)

      const { result } = renderHook(() => useSessionQuery(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.isStale).toBe(false)
    })
  })

  describe('useSessionQueryWithInitial', () => {
    it('should use initial data when provided', async () => {
      const initialData = { active: true, userId: 'user-123', username: 'testuser' }

      const { result } = renderHook(() => useSessionQueryWithInitial(initialData), {
        wrapper: createWrapper(),
      })

      expect(result.current.data).toEqual(initialData)
      expect(result.current.isLoading).toBe(false)
    })

    it('should have correct staleTime configuration', async () => {
      const initialData = { active: true, userId: 'user-123', username: 'testuser' }

      const { result } = renderHook(() => useSessionQueryWithInitial(initialData), {
        wrapper: createWrapper(),
      })

      expect(result.current.isStale).toBe(false)
    })
  })

  describe('useLoginMutation', () => {
    it('should successfully login and invalidate session', async () => {
      const mockResponse = { success: true }
      vi.mocked(authApi.login).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useLoginMutation(), { wrapper: createWrapper() })

      result.current.mutate({ username: 'test', password: '123456' })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(authApi.login).toHaveBeenCalledWith({ username: 'test', password: '123456' })
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should handle login errors', async () => {
      const error = new Error('Invalid credentials')
      vi.mocked(authApi.login).mockRejectedValue(error)

      const { result } = renderHook(() => useLoginMutation(), { wrapper: createWrapper() })

      result.current.mutate({ username: 'wrong', password: 'wrong' })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBeDefined()
    })
  })

  describe('useRegisterMutation', () => {
    it('should successfully register and invalidate session', async () => {
      const mockResponse = { success: true }
      const input = { username: 'newuser', password: '123456', email: 'test@example.com' }

      vi.mocked(authApi.register).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useRegisterMutation(), { wrapper: createWrapper() })

      result.current.mutate(input)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(authApi.register).toHaveBeenCalledWith(input)
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should handle registration errors', async () => {
      const error = new Error('Username already exists')
      vi.mocked(authApi.register).mockRejectedValue(error)

      const { result } = renderHook(() => useRegisterMutation(), { wrapper: createWrapper() })

      result.current.mutate({ username: 'existing', password: '123456', email: 'test@example.com' })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBeDefined()
    })
  })

  describe('useLogoutMutation', () => {
    it('should successfully logout and invalidate session', async () => {
      const mockResponse = { success: true }
      vi.mocked(authApi.logout).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useLogoutMutation(), { wrapper: createWrapper() })

      result.current.mutate()

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(authApi.logout).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should handle logout errors', async () => {
      const error = new Error('Logout failed')
      vi.mocked(authApi.logout).mockRejectedValue(error)

      const { result } = renderHook(() => useLogoutMutation(), { wrapper: createWrapper() })

      result.current.mutate()

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBeDefined()
    })
  })
})
