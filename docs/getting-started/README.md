# Быстрый старт

## Установка и запуск

```bash
pnpm install
pnpm dev
```

## Переменные окружения

Создайте `.env.local`:

```env
# Base URL продуктового API (используется openapi-fetch клиентом)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Auth HTTP gateway (см. `hackaton-platform-api/docs/auth/rest-guide.md`)
AUTH_GATEWAY_BASE_URL=http://localhost:8080

# (Опционально) URL OpenAPI схемы продуктового API
OPENAPI_URL=https://api.example.com/openapi.json
```
