import 'server-only'

/**
 * Server-only env (НЕ импортировать в client components).
 *
 * AUTH_GATEWAY_BASE_URL — HTTP gateway (см. hackaton-platform-api/docs/auth/rest-guide.md)
 * По умолчанию: http://localhost:8080
 *
 * REMOTE_API_BASE_URL — задеплоенный стенд, используется по умолчанию в dev если не выбран local.
 */
export const envServer = {
  authGatewayBaseUrl: process.env.AUTH_GATEWAY_BASE_URL || 'http://localhost:8080',
  platformApiBaseUrl:
    process.env.PLATFORM_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:8080',
  remoteApiBaseUrl: process.env.REMOTE_API_BASE_URL || 'http://178.154.192.57:8080',
} as const
