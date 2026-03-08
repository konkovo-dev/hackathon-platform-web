import 'server-only'

import { getEffectiveAuthGatewayUrl } from '@/shared/lib/debug/backendTarget'

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

export async function authGatewayPost<TResponse extends Json>(
  path: string,
  body: Json
): Promise<
  { ok: true; data: TResponse; status: number } | { ok: false; error: Json; status: number }
> {
  const url = `${getEffectiveAuthGatewayUrl()}${path}`

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
      const json = (await tryParseJson(res)) || {}
      const message =
        (typeof json.message === 'string' && json.message.trim()) ||
        res.statusText ||
        'Auth request failed'
      return { ok: false, error: { ...json, message }, status: res.status }
    }

    const data = ((await tryParseJson(res)) || {}) as TResponse
    return { ok: true, data, status: res.status }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error'
    return { ok: false, error: { message }, status: 502 }
  }
}

export async function proxyAuthPost<TResponse extends Json>(
  path: string,
  body: Json
): Promise<
  { ok: true; data: TResponse } | { ok: false; response: import('next/server').NextResponse }
> {
  const { NextResponse } = await import('next/server')
  const result = await authGatewayPost<TResponse>(path, body)

  if (result.ok) return { ok: true, data: result.data }
  return { ok: false, response: NextResponse.json(result.error, { status: result.status }) }
}
