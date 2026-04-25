import { NextResponse } from 'next/server'
import { proxyAuthPost } from '@/shared/lib/auth/proxyAuthGateway'
import { setAuthCookies } from '@/shared/lib/auth/server'
import type { components as AuthGatewayComponents } from '@/shared/api/authGateway.schema'
import { mapAuthGatewayErrorToBff } from '../_lib/errorMap'
import { randomUUID } from '@/shared/lib/randomUuid'

type TokenPairResponse = AuthGatewayComponents['schemas']['TokenPairResponse']
type RegisterRequest = AuthGatewayComponents['schemas']['RegisterRequest']

export async function POST(req: Request) {
  const raw = (await req.json().catch(() => null)) as {
    username?: string
    email?: string
    password?: string
    firstName?: string
    lastName?: string
    timezone?: string
  } | null

  const username = raw?.username?.trim()
  const email = raw?.email?.trim()
  const password = raw?.password
  const firstName = raw?.firstName?.trim()
  const lastName = raw?.lastName?.trim()
  const timezone = raw?.timezone?.trim()

  if (!username || !email || !password || !firstName || !lastName || !timezone) {
    return NextResponse.json(
      { message: 'Invalid payload', code: 'INVALID_PAYLOAD' },
      { status: 400 }
    )
  }

  const payload: RegisterRequest = {
    username,
    email,
    password,
    first_name: firstName,
    last_name: lastName,
    timezone,
    idempotency_key: { key: randomUUID() },
  }

  const result = await proxyAuthPost<TokenPairResponse>('/v1/auth/register', payload)
  if (!result.ok) {
    const json = await result.response.json().catch(() => ({}))
    return NextResponse.json(mapAuthGatewayErrorToBff(json), { status: result.response.status })
  }

  await setAuthCookies(result.data)
  return NextResponse.json({ ok: true })
}
