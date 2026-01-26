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

## Клиент продуктового API

Базовый клиент для продуктового API:

- `src/shared/api/platformClient.ts` — текущий fetch-клиент (не зависит от OpenAPI)

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

## Безопасность токенов и “Запомнить меня”

### Где и как хранятся токены

Токены **не сохраняются в `localStorage`/`sessionStorage`** и **не доступны из JS**:

- access/refresh записываются только на сервере в `httpOnly` cookies (см. `src/shared/lib/auth/server.ts`)
- UI общается с auth только через BFF (`/api/auth/*`)
- продуктовые запросы идут через BFF `/api/platform/*`, где сервер подставляет `Authorization` сам

Cookie-флаги:

- `httpOnly: true` — защищает от утечки токенов через XSS (JS не может прочитать cookie)
- `secure: true` только в production — cookie передаются только по HTTPS
- `sameSite: 'lax'` — снижает риск CSRF (браузер не отправляет эти cookies на большинство cross-site запросов)
- `path: '/'` — доступны на всём сайте
- `maxAge` выставляется **только если** auth gateway отдаёт `accessExpiresAt/refreshExpiresAt`
  - если `maxAge` не выставлен — cookie становятся “session cookies” и обычно не переживают перезапуск браузера

### Как влияет “Запомнить меня”

Сейчас **никак**: чекбокс “Запомнить меня” в `src/features/auth/ui/LoginForm.tsx` не влияет на payload,
потому что в запрос `/api/auth/login` отправляются только `{ login, password }` (см. `openapi/auth-bff.openapi.yaml`).

Фактическая “длина” сессии определяется **TTL refresh token’а**, который выдаёт auth gateway (и тем,
выставляется ли `refreshExpiresAt` → `maxAge` для cookie).

Если нужно реальное поведение “запомнить меня”, обычно делается одно из:

- расширить контракт BFF (`BffLoginRequest`) полем вроде `rememberMe: boolean` и прокинуть в auth gateway,
  чтобы он выдавал refresh token с другим TTL
- или иметь отдельные login endpoints/режимы на бекенде

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
 
