import { NextResponse } from 'next/server'
import { proxyAuthPost } from '@/shared/lib/auth/proxyAuthGateway'
import {
  clearAuthCookies,
  getRefreshTokenFromCookies,
  setAuthCookies,
} from '@/shared/lib/auth/server'
import type { components as AuthGatewayComponents } from '@/shared/api/authGateway.schema'
import { mapAuthGatewayErrorToBff } from '../_lib/errorMap'

type TokenPairResponse = AuthGatewayComponents['schemas']['TokenPairResponse']

export async function POST() {
  const refreshToken = getRefreshTokenFromCookies()
  if (!refreshToken) {
    return NextResponse.json(
      { message: 'No refresh token', code: 'AUTH_REQUIRED' },
      { status: 401 }
    )
  }

  const result = await proxyAuthPost<TokenPairResponse>('/v1/auth/refresh', {
    refresh_token: refreshToken,
  })
  if (!result.ok) {
    if (result.response.status === 401 || result.response.status === 403) {
      clearAuthCookies()
    }
    const json = await result.response.json().catch(() => ({}))
    return NextResponse.json(mapAuthGatewayErrorToBff(json), { status: result.response.status })
  }

  setAuthCookies(result.data)
  return NextResponse.json({ ok: true })
}
