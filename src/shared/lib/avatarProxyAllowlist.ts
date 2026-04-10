/**
 * Публичный origin хранилища аватаров (как отдаёт API в avatarUrl).
 */
const DEFAULT_AVATAR_STORAGE_ORIGIN = 'http://localhost:9000'

function parseOrigin(raw: string): URL {
  return new URL(raw.includes('://') ? raw : `http://${raw}`)
}

/** Сырое значение из env (для тестов и диагностики). */
export function getAvatarStoragePublicOriginRaw(): string {
  return process.env.NEXT_PUBLIC_AVATAR_STORAGE_ORIGIN?.trim() || DEFAULT_AVATAR_STORAGE_ORIGIN
}

function originKey(u: URL): string {
  const port = u.port || (u.protocol === 'https:' ? '443' : u.protocol === 'http:' ? '80' : '')
  return `${u.protocol}//${u.hostname}:${port}`
}

export function isAvatarProxyAllowedUrl(target: URL): boolean {
  try {
    const configured = parseOrigin(getAvatarStoragePublicOriginRaw())
    return originKey(target) === originKey(configured)
  } catch {
    return false
  }
}
