/**
 * Конфигурация переменных окружения
 */

export const env = {
  apiBaseUrl: '/api/platform',
  // Backend URLs для серверных запросов
  platformApiUrl: process.env.PLATFORM_API_BASE_URL || process.env.NEXT_PUBLIC_PLATFORM_API_URL,
  authGatewayUrl: process.env.AUTH_GATEWAY_BASE_URL || process.env.NEXT_PUBLIC_AUTH_GATEWAY_URL,
} as const
