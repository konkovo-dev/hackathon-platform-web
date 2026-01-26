import type { components as AuthBffComponents } from '@/shared/api/authBff.schema'
import { ApiError, parseApiErrorResponse } from '@/shared/api/errors'

type ErrorResponse = AuthBffComponents['schemas']['ErrorResponse']
type LoginRequest = AuthBffComponents['schemas']['BffLoginRequest']
type RegisterRequest = AuthBffComponents['schemas']['BffRegisterRequest']
type OkResponse = AuthBffComponents['schemas']['BffOkResponse']
type SessionResponse = AuthBffComponents['schemas']['BffSessionResponse']

async function assertOk(res: Response): Promise<void> {
  if (res.ok) return

  const data = await parseApiErrorResponse(res.clone())
  throw new ApiError(data)
}

export const authApi = {
  async login(input: LoginRequest): Promise<OkResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    })
    await assertOk(res)
    return (await res.json()) as OkResponse
  },

  async register(input: RegisterRequest): Promise<OkResponse> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    })
    await assertOk(res)
    return (await res.json()) as OkResponse
  },

  async logout(): Promise<OkResponse> {
    const res = await fetch('/api/auth/logout', { method: 'POST' })
    await assertOk(res)
    return (await res.json()) as OkResponse
  },

  async refresh(): Promise<OkResponse> {
    const res = await fetch('/api/auth/refresh', { method: 'POST' })
    await assertOk(res)
    return (await res.json()) as OkResponse
  },

  async session(): Promise<SessionResponse> {
    const res = await fetch('/api/auth/session', { method: 'GET' })
    await assertOk(res)
    return (await res.json()) as SessionResponse
  },
}
