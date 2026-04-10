import { NextRequest, NextResponse } from 'next/server'
import { isAvatarProxyAllowedUrl } from '@/shared/lib/avatarProxyAllowlist'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams.get('url')
  if (!param?.trim()) {
    return NextResponse.json({ message: 'missing url' }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(param.trim())
  } catch {
    return NextResponse.json({ message: 'invalid url' }, { status: 400 })
  }

  if (target.username || target.password) {
    return NextResponse.json({ message: 'url not allowed' }, { status: 403 })
  }

  if (!isAvatarProxyAllowedUrl(target)) {
    return NextResponse.json({ message: 'host not allowed' }, { status: 403 })
  }

  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    return NextResponse.json({ message: 'scheme not allowed' }, { status: 403 })
  }

  let upstream: Response
  try {
    upstream = await fetch(target.href, {
      method: 'GET',
      cache: 'no-store',
      redirect: 'follow',
    })
  } catch {
    return NextResponse.json({ message: 'upstream fetch failed' }, { status: 502 })
  }

  if (!upstream.ok) {
    return new NextResponse(null, { status: upstream.status === 404 ? 404 : upstream.status })
  }

  const headers = new Headers()
  const ct = upstream.headers.get('content-type')
  if (ct) headers.set('content-type', ct)
  headers.set('cache-control', 'public, max-age=300')

  return new NextResponse(upstream.body, { status: 200, headers })
}
