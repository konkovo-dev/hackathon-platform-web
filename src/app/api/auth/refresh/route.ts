import { NextResponse } from 'next/server'
import { proxyAuthPost } from '@/shared/lib/auth/proxyAuthGateway'
import { getRefreshTokenFromCookies, setAuthCookies } from '@/shared/lib/auth/server'
import type { components as AuthGatewayComponents } from '@/shared/api/authGateway.schema'

type TokenPairResponse = AuthGatewayComponents['schemas']['TokenPairResponse']

export async function POST() {
  const refreshToken = getRefreshTokenFromCookies()
  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 })
  }

  const result = await proxyAuthPost<TokenPairResponse>('/v1/auth/refresh', {
    refresh_token: refreshToken,
  })
  if (!result.ok) return result.response

  setAuthCookies(result.data)
  return NextResponse.json({ ok: true })
}
