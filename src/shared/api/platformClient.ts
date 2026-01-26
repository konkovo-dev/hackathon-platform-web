import { env } from '@/shared/config/env'
import { ApiError, parseApiErrorResponse } from './errors'

function joinPath(base: string, path: string) {
  const baseTrimmed = base.endsWith('/') ? base.slice(0, -1) : base
  const pathTrimmed = path.startsWith('/') ? path : `/${path}`
  return `${baseTrimmed}${pathTrimmed}`
}

async function getServerOrigin(): Promise<string> {
  const { headers } = await import('next/headers')
  const h = await headers()

  const proto = h.get('x-forwarded-proto') || 'http'
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  return `${proto}://${host}`
}

async function getServerCookieHeader(): Promise<string | undefined> {
  const { headers } = await import('next/headers')
  const h = await headers()
  const cookie = h.get('cookie') || undefined
  return cookie
}

export async function platformFetchJson<TResponse>(
  path: string,
  init?: Omit<RequestInit, 'headers'> & { headers?: HeadersInit }
): Promise<TResponse> {
  const urlPath = joinPath(env.apiBaseUrl, path)
  const isServer = typeof window === 'undefined'
  const url = isServer && urlPath.startsWith('/') ? new URL(urlPath, await getServerOrigin()).toString() : urlPath

  const cookieHeader = isServer ? await getServerCookieHeader() : undefined

  const res = await fetch(url, {
    ...init,
    headers: {
      accept: 'application/json',
      ...(init?.headers || {}),
      ...(cookieHeader ? { cookie: cookieHeader } : null),
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = await parseApiErrorResponse(res.clone())
    throw new ApiError(err)
  }

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new ApiError({ message: 'Unexpected response content-type', status: res.status })
  }

  return (await res.json()) as TResponse
}
