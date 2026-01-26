import { NextResponse } from 'next/server'
import { proxyAuthPost } from '@/shared/lib/auth/proxyAuthGateway'
import { getAccessTokenFromCookies } from '@/shared/lib/auth/server'
import type { components as AuthGatewayComponents } from '@/shared/api/authGateway.schema'

type IntrospectResponse = AuthGatewayComponents['schemas']['IntrospectResponse']

export async function GET() {
  const accessToken = getAccessTokenFromCookies()
  if (!accessToken) {
    return NextResponse.json({ active: false })
  }

  const result = await proxyAuthPost<IntrospectResponse>('/v1/auth/introspect', {
    access_token: accessToken,
  })

  if (!result.ok) {
    return NextResponse.json({ active: false })
  }

  const data = result.data as IntrospectResponse
  if (!('active' in data) || data.active !== true) {
    return NextResponse.json({ active: false })
  }

  return NextResponse.json({ active: true, userId: data.userId, expiresAt: data.expiresAt })
}
