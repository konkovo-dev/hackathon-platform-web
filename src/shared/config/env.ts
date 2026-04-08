/**
 * Конфигурация переменных окружения
 */

/**
 * Дефолт без env: Centrifugo на api.hackplatform.ru:8000 без TLS на сокете (типичный docker).
 * `wss://…:8000` даёт net::ERR_SSL_PROTOCOL_ERROR — на порту нет TLS-рукопожатия.
 */
const DEFAULT_CENTRIFUGO_WS_URL = 'ws://api.hackplatform.ru:8000/connection/websocket'

/**
 * URL WebSocket Centrifugo.
 * Для wss (прод по HTTPS за прокси / TLS на Centrifugo) задайте `NEXT_PUBLIC_CENTRIFUGO_WS_URL`.
 */
export function getCentrifugoWsUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CENTRIFUGO_WS_URL?.trim()
  if (fromEnv) return fromEnv
  return DEFAULT_CENTRIFUGO_WS_URL
}

export const env = {
  apiBaseUrl: '/api/platform',
  // Backend URLs для серверных запросов
  platformApiUrl: process.env.PLATFORM_API_BASE_URL || process.env.NEXT_PUBLIC_PLATFORM_API_URL,
  authGatewayUrl: process.env.AUTH_GATEWAY_BASE_URL || process.env.NEXT_PUBLIC_AUTH_GATEWAY_URL,
  centrifugoWsUrl: getCentrifugoWsUrl(),
} as const
