import { NextResponse } from 'next/server'
import { proxyAuthPost } from '@/shared/lib/auth/proxyAuthGateway'
import { clearAuthCookies, getRefreshTokenFromCookies } from '@/shared/lib/auth/server'
import { mapAuthGatewayErrorToBff } from '../_lib/errorMap'

export async function POST() {
  const refreshToken = getRefreshTokenFromCookies()

  if (!refreshToken) {
    clearAuthCookies()
    return NextResponse.json({ ok: true })
  }

  const result = await proxyAuthPost<Record<string, never>>('/v1/auth/logout', {
    refresh_token: refreshToken,
  })

  clearAuthCookies()
  if (!result.ok) {
    const json = await result.response.json().catch(() => ({}))
    return NextResponse.json(mapAuthGatewayErrorToBff(json), { status: result.response.status })
  }

  return NextResponse.json({ ok: true })
}
