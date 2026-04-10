import { afterEach, describe, expect, it, vi } from 'vitest'
import { getAvatarStoragePublicOriginRaw, isAvatarProxyAllowedUrl } from './avatarProxyAllowlist'

describe('avatar storage origin', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('allows only URLs whose origin matches NEXT_PUBLIC_AVATAR_STORAGE_ORIGIN', () => {
    vi.stubEnv('NEXT_PUBLIC_AVATAR_STORAGE_ORIGIN', 'http://storage.test:9000')
    expect(isAvatarProxyAllowedUrl(new URL('http://storage.test:9000/avatars/x'))).toBe(true)
    expect(isAvatarProxyAllowedUrl(new URL('https://storage.test:9000/avatars/x'))).toBe(false)
  })

  it('rejects other hosts', () => {
    vi.stubEnv('NEXT_PUBLIC_AVATAR_STORAGE_ORIGIN', 'http://storage.test:9000')
    expect(isAvatarProxyAllowedUrl(new URL('http://evil.com/avatars/x'))).toBe(false)
  })

  it('defaults to http://localhost:9000 when env is unset', () => {
    expect(getAvatarStoragePublicOriginRaw()).toBe('http://localhost:9000')
    expect(isAvatarProxyAllowedUrl(new URL('http://localhost:9000/a'))).toBe(true)
    expect(isAvatarProxyAllowedUrl(new URL('http://api.hackplatform.ru:9000/a'))).toBe(false)
  })

  it('exposes getAvatarStoragePublicOriginRaw from env', () => {
    vi.stubEnv('NEXT_PUBLIC_AVATAR_STORAGE_ORIGIN', 'http://minio.local:9000')
    expect(getAvatarStoragePublicOriginRaw()).toBe('http://minio.local:9000')
  })
})
