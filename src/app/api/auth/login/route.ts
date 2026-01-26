import { NextResponse } from 'next/server'
import { proxyAuthPost } from '@/shared/lib/auth/proxyAuthGateway'
import { setAuthCookies } from '@/shared/lib/auth/server'
import type { components as AuthGatewayComponents } from '@/shared/api/authGateway.schema'

type TokenPairResponse = AuthGatewayComponents['schemas']['TokenPairResponse']
type LoginRequest = AuthGatewayComponents['schemas']['LoginRequest']

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { login?: string; password?: string } | null
  const login = body?.login?.trim()
  const password = body?.password

  if (!login || !password) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
  }

  const payload: LoginRequest = login.includes('@')
    ? { email: login, password }
    : { username: login, password }

  const result = await proxyAuthPost<TokenPairResponse>('/v1/auth/login', payload)
  if (!result.ok) return result.response

  setAuthCookies(result.data)
  return NextResponse.json({ ok: true })
}
