import { env } from '@/shared/config/env'
import { ApiError, parseApiErrorResponse } from './errors'

function joinPath(base: string, path: string) {
  const baseTrimmed = base.endsWith('/') ? base.slice(0, -1) : base
  const pathTrimmed = path.startsWith('/') ? path : `/${path}`
  return `${baseTrimmed}${pathTrimmed}`
}

/**
 * Client-side API client - использует BFF для запросов
 */
export async function platformFetchJson<TResponse>(
  path: string,
  init?: Omit<RequestInit, 'headers'> & { headers?: HeadersInit }
): Promise<TResponse> {
  const urlPath = joinPath(env.apiBaseUrl, path)
  
  const fetchOptions: RequestInit = {
    ...init,
    headers: {
      accept: 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
    credentials: 'same-origin',
  }

  const res = await fetch(urlPath, fetchOptions)

  if (!res.ok) {
    const err = await parseApiErrorResponse(res.clone())
    err.url = urlPath
    throw new ApiError(err)
  }

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new ApiError({ message: 'Unexpected response content-type', status: res.status })
  }

  return (await res.json()) as TResponse
}
