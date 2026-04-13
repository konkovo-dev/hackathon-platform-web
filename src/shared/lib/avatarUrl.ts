import { isAvatarProxyAllowedUrl } from './avatarProxyAllowlist'

/**
 * Нормализация URL аватара для запроса картинки.
 */
export function normalizeAvatarImageSrc(raw: string): string {
  const t = raw.trim()
  if (!t) return t

  try {
    const u = new URL(t)

    const encodedPath = u.pathname
      .split('/')
      .map(segment => {
        if (segment === '') return ''
        let decoded = segment
        try {
          decoded = decodeURIComponent(segment)
        } catch {}
        return encodeURIComponent(decoded)
      })
      .join('/')

    return `${u.protocol}//${u.host}${encodedPath}${u.search}${u.hash}`
  } catch {
    return t
  }
}

/**
 * URL для <img src>: прокси через BFF для разрешённых origin MinIO/S3 (тот же origin, без mixed content).
 */
export function toAvatarImgSrc(raw: string): string {
  const normalized = normalizeAvatarImageSrc(raw)
  try {
    const u = new URL(normalized)
    if (isAvatarProxyAllowedUrl(u)) {
      return `/api/avatar-proxy?url=${encodeURIComponent(normalized)}`
    }
  } catch {
    /* noop */
  }
  return normalized
}
