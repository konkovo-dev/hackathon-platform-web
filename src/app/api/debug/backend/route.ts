import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  DEBUG_BACKEND_COOKIE,
  getDebugBackendTarget,
  getEffectiveAuthGatewayUrl,
  getEffectivePlatformApiUrl,
  type BackendTarget,
} from '@/shared/lib/debug/backendTarget'

function notInDev() {
  return NextResponse.json({ error: 'Only available in development' }, { status: 403 })
}

export function GET() {
  if (process.env.NODE_ENV !== 'development') return notInDev()

  const target = getDebugBackendTarget()
  return NextResponse.json({
    target,
    platformApiUrl: getEffectivePlatformApiUrl(),
    authGatewayUrl: getEffectiveAuthGatewayUrl(),
  })
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') return notInDev()

  const body = await req.json().catch(() => null)
  const target: BackendTarget = body?.target === 'local' ? 'local' : 'remote'

  cookies().set(DEBUG_BACKEND_COOKIE, target, {
    httpOnly: false,
    path: '/',
    sameSite: 'lax',
  })

  return NextResponse.json({
    target,
    platformApiUrl: getEffectivePlatformApiUrl(),
    authGatewayUrl: getEffectiveAuthGatewayUrl(),
  })
}
