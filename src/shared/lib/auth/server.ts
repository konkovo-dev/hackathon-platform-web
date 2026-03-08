import 'server-only'

import { cookies } from 'next/headers'

export const AUTH_COOKIE_ACCESS = 'hp_access_token'
export const AUTH_COOKIE_REFRESH = 'hp_refresh_token'

type TokenPair = {
  accessToken: string
  refreshToken: string
  accessExpiresAt?: string
  refreshExpiresAt?: string
}

const isProd = process.env.NODE_ENV === 'production'

function toMaxAgeSeconds(expiresAtIso?: string): number | undefined {
  if (!expiresAtIso) return undefined
  const ms = Date.parse(expiresAtIso)
  if (Number.isNaN(ms)) return undefined
  const diff = Math.floor((ms - Date.now()) / 1000)
  if (diff <= 5) return undefined
  return diff
}

export function setAuthCookies(tokens: TokenPair) {
  const store = cookies()

  store.set(AUTH_COOKIE_ACCESS, tokens.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: toMaxAgeSeconds(tokens.accessExpiresAt),
  })

  store.set(AUTH_COOKIE_REFRESH, tokens.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: toMaxAgeSeconds(tokens.refreshExpiresAt),
  })
}

export function clearAuthCookies() {
  const store = cookies()

  store.set(AUTH_COOKIE_ACCESS, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  store.set(AUTH_COOKIE_REFRESH, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export function getAccessTokenFromCookies(): string | undefined {
  return cookies().get(AUTH_COOKIE_ACCESS)?.value
}

export function getRefreshTokenFromCookies(): string | undefined {
  return cookies().get(AUTH_COOKIE_REFRESH)?.value
}
