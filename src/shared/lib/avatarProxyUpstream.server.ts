import 'server-only'

/**
 * Реальный URL для fetch аватара с сервера Next.
 *
 * Порядок приоритетов:
 * 1. AVATAR_PROXY_FETCH_BASE_URL — явный override для нестандартных сетевых топологий
 *    (например внутренний http://minio:9000 в Docker-сети)
 * 2. Оригинальный URL из avatarUrl: для https://*:9000 даунгрейдим до http,
 *    чтобы обойти TLS MinIO без сертификата.
 *
 * Платформенный API (:8080) намеренно НЕ используется как upstream —
 * он не проксирует /avatars/*, MinIO доступен только на :9000.
 */
export function resolveAvatarUpstreamFetchUrl(target: URL): string {
  const explicit = process.env.AVATAR_PROXY_FETCH_BASE_URL?.trim()
  if (explicit) {
    const base = new URL(explicit.includes('://') ? explicit : `http://${explicit}`)
    return `${base.origin}${target.pathname}${target.search}`
  }

  // Использовать исходный URL, но для https://*:9000 даунгрейдим до http
  const u = new URL(target.toString())
  if (u.port === '9000' && u.protocol === 'https:') {
    u.protocol = 'http:'
  }
  return u.toString()
}
