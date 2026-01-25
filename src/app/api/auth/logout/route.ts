import { NextResponse } from 'next/server'
import { proxyAuthPost } from '../_lib/proxy'
import { clearAuthCookies, getRefreshTokenFromCookies } from '@/shared/lib/auth/server'

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
  if (!result.ok) return result.response

  return NextResponse.json({ ok: true })
}
