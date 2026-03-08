import 'server-only'

import type { components as AuthGatewayComponents } from '@/shared/api/authGateway.schema'
import { getAccessTokenFromCookies } from '@/shared/lib/auth/server'
import { authGatewayPost } from '@/shared/lib/auth/proxyAuthGateway'

export type SessionSnapshot =
  | { active: false }
  | { active: true; userId: string; expiresAt: string }

type IntrospectResponse = AuthGatewayComponents['schemas']['IntrospectResponse']

export async function getServerSession(): Promise<SessionSnapshot> {
  const accessToken = getAccessTokenFromCookies()
  if (!accessToken) return { active: false }

  const result = await authGatewayPost<IntrospectResponse>('/v1/auth/introspect', {
    access_token: accessToken,
  })
  if (!result.ok) return { active: false }

  const data = result.data as IntrospectResponse
  if (!('active' in data) || data.active !== true) return { active: false }

  return { active: true, userId: data.userId, expiresAt: data.expiresAt }
}
