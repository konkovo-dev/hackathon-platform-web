import 'server-only'

/**
 * Server-only env (НЕ импортировать в client components).
 *
 * AUTH_GATEWAY_BASE_URL — HTTP gateway (см. hackaton-platform-api/docs/auth/rest-guide.md)
 * По умолчанию: http://localhost:8080
 */
export const envServer = {
  authGatewayBaseUrl: process.env.AUTH_GATEWAY_BASE_URL || 'http://localhost:8080',
} as const
