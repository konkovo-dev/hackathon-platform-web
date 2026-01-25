import 'server-only'

import { NextResponse } from 'next/server'
import { envServer } from '@/shared/config/env.server'

type Json = Record<string, unknown>

async function tryParseJson(response: Response): Promise<Json | undefined> {
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) return undefined
  try {
    return (await response.json()) as Json
  } catch {
    return undefined
  }
}

export async function proxyAuthPost<TResponse extends Json>(
  path: string,
  body: Json
): Promise<{ ok: true; data: TResponse } | { ok: false; response: NextResponse }> {
  const url = `${envServer.authGatewayBaseUrl}${path}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    if (!res.ok) {
      const json = await tryParseJson(res)
      const message =
        (typeof json?.message === 'string' && json.message) || res.statusText || 'Auth request failed'
      return {
        ok: false,
        response: NextResponse.json({ message }, { status: res.status }),
      }
    }

    const data = ((await tryParseJson(res)) || {}) as TResponse
    return { ok: true, data }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error'
    return {
      ok: false,
      response: NextResponse.json({ message }, { status: 502 }),
    }
  }
}
