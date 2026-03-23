import 'server-only'

import { getAccessTokenFromCookies } from '@/shared/lib/auth/server'
import { getEffectivePlatformApiUrl } from '@/shared/lib/debug/backendTarget'
import { ApiError, parseApiErrorResponse } from './errors'

function joinPath(base: string, path: string) {
  const baseTrimmed = base.endsWith('/') ? base.slice(0, -1) : base
  const pathTrimmed = path.startsWith('/') ? path : `/${path}`
  return `${baseTrimmed}${pathTrimmed}`
}

/**
 * Server-side API client - делает прямые запросы к backend с Authorization header
 */
export async function platformFetchJsonServer<TResponse>(
  path: string,
  init?: Omit<RequestInit, 'headers'> & { headers?: HeadersInit }
): Promise<TResponse> {
  const accessToken = await getAccessTokenFromCookies()
  const backendUrl = await getEffectivePlatformApiUrl()

  const fullUrl = joinPath(backendUrl, path)

  const fetchOptions: RequestInit = {
    ...init,
    headers: {
      accept: 'application/json',
      ...(accessToken && { authorization: `Bearer ${accessToken}` }),
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  }

  const res = await fetch(fullUrl, fetchOptions)

  if (!res.ok) {
    const err = await parseApiErrorResponse(res.clone())
    err.url = fullUrl
    throw new ApiError(err)
  }

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new ApiError({ message: 'Unexpected response content-type', status: res.status })
  }

  return (await res.json()) as TResponse
}
