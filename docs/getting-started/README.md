# Быстрый старт

## Установка и запуск

```bash
pnpm install
pnpm dev
```

## Переменные окружения

Создайте `.env.local`:

```env
# Base URL продуктового API для BFF-прокси (Next.js server-side).
# Все клиентские запросы продукта идут через /api/platform/*,
PLATFORM_API_BASE_URL=http://localhost:3001/api

# Auth HTTP gateway (см. `hackaton-platform-api/docs/auth/rest-guide.md`)
AUTH_GATEWAY_BASE_URL=http://localhost:8080

# (Опционально) URL OpenAPI схемы продуктового API
OPENAPI_URL=https://api.example.com/openapi.json
```

Примечания:

- `NEXT_PUBLIC_API_BASE_URL` по-прежнему может использоваться как fallback на сервере, но рекомендуем явно задавать `PLATFORM_API_BASE_URL`.
- Если вы меняли структуру роутов в `src/app/**` и ловите странные TS ошибки из `.next/types`, удалите `.next` и перезапустите `pnpm dev`/`pnpm typecheck`.
