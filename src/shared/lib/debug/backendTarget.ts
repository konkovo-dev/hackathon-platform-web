import 'server-only'

import { cookies } from 'next/headers'
import { envServer } from '@/shared/config/env.server'

export const DEBUG_BACKEND_COOKIE = 'hp_debug_backend'

export type BackendTarget = 'remote' | 'local'

export function getDebugBackendTarget(): BackendTarget {
  if (process.env.NODE_ENV !== 'development') return 'remote'
  const value = cookies().get(DEBUG_BACKEND_COOKIE)?.value
  return value === 'local' ? 'local' : 'remote'
}

export function getEffectivePlatformApiUrl(): string {
  return getDebugBackendTarget() === 'local'
    ? envServer.platformApiBaseUrl
    : envServer.remoteApiBaseUrl
}

export function getEffectiveAuthGatewayUrl(): string {
  return getDebugBackendTarget() === 'local'
    ? envServer.authGatewayBaseUrl
    : envServer.remoteApiBaseUrl
}
