import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { authApi } from './authApi'
import { ApiError } from '@/shared/api/errors'

describe('authApi', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch')
  })

  afterEach(() => {
    fetchSpy.mockRestore()
  })

  describe('login', () => {
    it('should successfully login with correct credentials', async () => {
      const mockResponse = { ok: true }
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await authApi.login({ login: 'test', password: '123456' })

      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ login: 'test', password: '123456' }),
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw ApiError on failed login', async () => {
      const errorData = {
        code: 'INVALID_CREDENTIALS',
        message: 'Неверный логин или пароль',
      }

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        clone: () => ({
          json: async () => errorData,
          headers: new Headers({ 'content-type': 'application/json' }),
        }),
      } as any)

      await expect(authApi.login({ login: 'wrong', password: 'wrong' })).rejects.toThrow(ApiError)
    })

    it('should handle network errors', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('Network error'))

      await expect(authApi.login({ login: 'test', password: '123456' })).rejects.toThrow(
        'Network error'
      )
    })
  })

  describe('register', () => {
    it('should successfully register new user', async () => {
      const mockResponse = { ok: true }
      const input = {
        username: 'newuser',
        email: 'test@example.com',
        password: '123456',
        firstName: 'Иван',
        lastName: 'Иванов',
        timezone: 'Europe/Moscow',
      }

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await authApi.register(input)

      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw ApiError when username already exists', async () => {
      const errorData = {
        code: 'USERNAME_EXISTS',
        message: 'Пользователь с таким именем уже существует',
      }

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        headers: new Headers({ 'content-type': 'application/json' }),
        clone: () => ({
          json: async () => errorData,
          headers: new Headers({ 'content-type': 'application/json' }),
        }),
      } as any)

      await expect(
        authApi.register({
          username: 'existing',
          email: 'test@example.com',
          password: '123456',
          firstName: 'Иван',
          lastName: 'Иванов',
          timezone: 'Europe/Moscow',
        })
      ).rejects.toThrow(ApiError)
    })
  })

  describe('logout', () => {
    it('should successfully logout', async () => {
      const mockResponse = { ok: true }
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await authApi.logout()

      expect(fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
      expect(result).toEqual(mockResponse)
    })

    it('should handle logout errors', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'application/json' }),
        clone: () => ({
          json: async () => ({ code: 'INTERNAL_ERROR', message: 'Internal error' }),
          headers: new Headers({ 'content-type': 'application/json' }),
        }),
      } as any)

      await expect(authApi.logout()).rejects.toThrow(ApiError)
    })
  })

  describe('refresh', () => {
    it('should successfully refresh token', async () => {
      const mockResponse = { ok: true }
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await authApi.refresh()

      expect(fetch).toHaveBeenCalledWith('/api/auth/refresh', { method: 'POST' })
      expect(result).toEqual(mockResponse)
    })

    it('should throw ApiError when refresh token is invalid', async () => {
      const errorData = {
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Refresh token недействителен',
      }

      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        clone: () => ({
          json: async () => errorData,
          headers: new Headers({ 'content-type': 'application/json' }),
        }),
      } as any)

      await expect(authApi.refresh()).rejects.toThrow(ApiError)
    })
  })

  describe('session', () => {
    it('should successfully get session data', async () => {
      const mockResponse = {
        active: true,
        userId: 'user-123',
        expiresAt: '2026-04-01T00:00:00Z',
      }

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await authApi.session()

      expect(fetch).toHaveBeenCalledWith('/api/auth/session', { method: 'GET' })
      expect(result).toEqual(mockResponse)
    })

    it('should return inactive session when not authenticated', async () => {
      const mockResponse = { active: false }

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await authApi.session()

      expect(result).toEqual(mockResponse)
    })

    it('should handle session fetch errors', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'application/json' }),
        clone: () => ({
          json: async () => ({ code: 'INTERNAL_ERROR', message: 'Internal error' }),
          headers: new Headers({ 'content-type': 'application/json' }),
        }),
      } as any)

      await expect(authApi.session()).rejects.toThrow(ApiError)
    })
  })
})
