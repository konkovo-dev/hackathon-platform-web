const DEFAULT_AVATAR_PROXY_ORIGINS = [
  'https://api.hackplatform.ru:9000',
  'http://api.hackplatform.ru:9000',
  'http://127.0.0.1:9000',
  'http://localhost:9000',
]

export function getAvatarProxyAllowedOriginStrings(): string[] {
  const raw =
    process.env.NEXT_PUBLIC_AVATAR_PROXY_ALLOWED_ORIGINS?.trim() ||
    process.env.AVATAR_PROXY_ALLOWED_ORIGINS?.trim()
  if (raw) {
    return raw.split(',').map(s => s.trim()).filter(Boolean)
  }
  return DEFAULT_AVATAR_PROXY_ORIGINS
}

function originKey(u: URL): string {
  const port = u.port || (u.protocol === 'https:' ? '443' : u.protocol === 'http:' ? '80' : '')
  return `${u.protocol}//${u.hostname}:${port}`
}

export function isAvatarProxyAllowedUrl(target: URL): boolean {
  const tKey = originKey(target)
  return getAvatarProxyAllowedOriginStrings().some(allowed => {
    try {
      const a = new URL(allowed.includes('://') ? allowed : `https://${allowed}`)
      return originKey(a) === tKey
    } catch {
      return false
    }
  })
}
