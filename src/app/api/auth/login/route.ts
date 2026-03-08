import { NextResponse } from 'next/server'
import { proxyAuthPost } from '@/shared/lib/auth/proxyAuthGateway'
import { setAuthCookies } from '@/shared/lib/auth/server'
import type { components as AuthGatewayComponents } from '@/shared/api/authGateway.schema'
import { mapAuthGatewayErrorToBff } from '../_lib/errorMap'

type TokenPairResponse = AuthGatewayComponents['schemas']['TokenPairResponse']
type LoginRequest = AuthGatewayComponents['schemas']['LoginRequest']

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { login?: string; password?: string } | null
  const login = body?.login?.trim()
  const password = body?.password

  if (!login || !password) {
    return NextResponse.json(
      {
        message: 'Invalid payload',
        code: 'INVALID_PAYLOAD',
        fieldErrors: { login: ['INVALID_PAYLOAD'], password: ['INVALID_PAYLOAD'] },
      },
      { status: 400 }
    )
  }

  const payload: LoginRequest = login.includes('@')
    ? { email: login, password }
    : { username: login, password }

  const result = await proxyAuthPost<TokenPairResponse>('/v1/auth/login', payload)
  if (!result.ok) {
    const json = await result.response.json().catch(() => ({}))
    return NextResponse.json(mapAuthGatewayErrorToBff(json), { status: result.response.status })
  }

  setAuthCookies(result.data)
  return NextResponse.json({ ok: true })
}
