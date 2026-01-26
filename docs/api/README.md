# API и OpenAPI

В проекте **модели и контракты генерируются из OpenAPI**. Ручные “DTO типы” не поддерживаем.

## Генерация типов (единая команда)

Запуск:

```bash
pnpm api:gen
```

Команда читает конфиг `openapi/openapi.config.json` и генерирует типы в `src/shared/api/**`.

## Конфиг генерации

Файлы:

- `openapi/openapi.config.json` — список генераторов (input → output)
- `scripts/openapi.mjs` — раннер, который прогоняет `openapi-typescript` по конфигу

### Что генерируется сейчас

- **Auth gateway (контракт бекенда)**:
  - spec: `openapi/auth-gateway.openapi.yaml`
  - output: `src/shared/api/authGateway.schema.ts`
  - endpoints: `/v1/auth/*`

- **Auth BFF (контракт фронта к Next.js)**:
  - spec: `openapi/auth-bff.openapi.yaml`
  - output: `src/shared/api/authBff.schema.ts`
  - endpoints: `/api/auth/*`

- **Platform API (опционально)**:
  - input: env `OPENAPI_URL`
  - output: `src/shared/api/schema.ts`
  - если `OPENAPI_URL` не задан — генерация этого файла пропускается

## Клиент (openapi-fetch)

Базовый клиент для продуктового API:

- `src/shared/api/platformClient.ts` — текущий fetch-клиент (работает даже если OpenAPI для платформы ещё заглушка)
- `src/shared/api/client.ts` — openapi-fetch клиент (станет полезен, когда `OPENAPI_URL` реально задан и `schema.ts` не заглушка)

Важно: продуктовые запросы идут **через BFF-прокси**:

- браузер → `/api/platform/*`
- Next.js → `{PLATFORM_API_BASE_URL}/*` (с подстановкой access token из httpOnly cookies)
- при `401` выполняется `POST /api/auth/refresh` и **повтор запроса 1 раз**

## Auth: как устроено сейчас

Авторизация реализована через **BFF Route Handlers** в Next.js:

- браузер ходит в `/api/auth/*`
- сервер Next.js проксирует запросы на `AUTH_GATEWAY_BASE_URL` (`/v1/auth/*`)
- токены **не возвращаются в JS**, а сохраняются в **httpOnly cookies**:
  - `hp_access_token`
  - `hp_refresh_token`

Роуты:

- `POST /api/auth/login` → `POST {AUTH_GATEWAY_BASE_URL}/v1/auth/login`
- `POST /api/auth/register` → `POST {AUTH_GATEWAY_BASE_URL}/v1/auth/register`
- `POST /api/auth/refresh` → `POST {AUTH_GATEWAY_BASE_URL}/v1/auth/refresh` (refresh берётся из cookie)
- `POST /api/auth/logout` → `POST {AUTH_GATEWAY_BASE_URL}/v1/auth/logout` (refresh из cookie) + очистка cookies
- `GET /api/auth/session` → `POST {AUTH_GATEWAY_BASE_URL}/v1/auth/introspect` (access из cookie)

Полезные файлы:

- `src/shared/lib/auth/proxyAuthGateway.ts` — проксирование на auth gateway (server-only helper)
- `src/shared/lib/auth/server.ts` — set/get/clear httpOnly cookies
- `src/entities/auth/api/authApi.ts` — клиент для UI (ходит только в `/api/auth/*`)
- `src/features/auth/model/hooks.ts` — TanStack Query хуки (login/register/logout/session)

## Product API BFF proxy

Прокси-роут:

- `src/app/api/platform/[...path]/route.ts`

Переменные окружения:

- `PLATFORM_API_BASE_URL` — base url продуктового API (server-only)
- `OPENAPI_URL` — опционально, для генерации типов в `src/shared/api/schema.ts`
