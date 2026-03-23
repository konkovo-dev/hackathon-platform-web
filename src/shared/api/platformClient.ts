import { env } from '@/shared/config/env'
import { ApiError, parseApiErrorResponse } from './errors'

function joinPath(base: string, path: string) {
  const baseTrimmed = base.endsWith('/') ? base.slice(0, -1) : base
  const pathTrimmed = path.startsWith('/') ? path : `/${path}`
  return `${baseTrimmed}${pathTrimmed}`
}

/**
 * На сервере строит абсолютный URL и пробрасывает cookie для BFF.
 */
async function getFetchUrlAndHeaders(
  path: string,
  init?: Omit<RequestInit, 'headers'> & { headers?: HeadersInit }
): Promise<{ url: string; headers: HeadersInit }> {
  const urlPath = joinPath(env.apiBaseUrl, path)
  const baseHeaders: HeadersInit = {
    accept: 'application/json',
    ...(init?.headers || {}),
  }

  if (typeof window === 'undefined') {
    const { headers } = await import('next/headers')
    const h = await headers()
    const host = h.get('host') || 'localhost:3000'
    const proto = h.get('x-forwarded-proto') || 'http'
    const url = `${proto}://${host}${urlPath}`
    const cookie = h.get('cookie')
    return {
      url,
      headers: cookie ? { ...baseHeaders, cookie } : baseHeaders,
    }
  }

  return { url: urlPath, headers: baseHeaders }
}

/**
 * API client — использует BFF для запросов. Работает и в браузере, и в Server Components
 */
export async function platformFetchJson<TResponse>(
  path: string,
  init?: Omit<RequestInit, 'headers'> & { headers?: HeadersInit }
): Promise<TResponse> {
  const { url, headers } = await getFetchUrlAndHeaders(path, init)

  const fetchOptions: RequestInit = {
    ...init,
    headers,
    cache: 'no-store',
    credentials: 'same-origin',
  }

  const res = await fetch(url, fetchOptions)

  if (!res.ok) {
    const err = await parseApiErrorResponse(res.clone())
    err.url = url
    throw new ApiError(err)
  }

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new ApiError({ message: 'Unexpected response content-type', status: res.status })
  }

  return (await res.json()) as TResponse
}
