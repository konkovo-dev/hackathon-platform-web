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

- браузер → `/api/platform/*` (с `credentials: 'same-origin'` для автоматической отправки cookies)
- Next.js SSR → `/api/platform/*` (с явной передачей cookie header, т.к. credentials не работает для внутренних запросов)
- BFF → `{PLATFORM_API_BASE_URL}/*` (с подстановкой access token из httpOnly cookies в Authorization header)
- при `401` выполняется `POST /api/auth/refresh` и **повтор запроса 1 раз**

**Критично:** 
- **Клиент**: `credentials: 'same-origin'` → браузер автоматически отправляет `hp_access_token` cookie
- **Сервер (SSR)**: явная передача `cookie` header → Next.js не передает cookies автоматически во внутренних fetch к `/api/*`

## Ошибки: формат и обработка

### Единый формат на фронте

На фронте ошибки нормализуются в `ApiError` (`src/shared/api/errors.ts`):

- `message: string` — человекочитаемое сообщение
- `status?: number` — HTTP статус
- `code?: string` — опциональный код ошибки (если пришёл от BFF/бекенда)
- `fieldErrors?: Record<string, string[]>` — ошибки по полям (если бекенд их отдаёт)

### Что возвращают BFF endpoints

- **Auth BFF** (`/api/auth/*`):
  - в случае ошибки возвращает JSON с тем же HTTP status и форматом:
    - `{ message, code?, fieldErrors? }`
    - `code` — **доменный** код для UI (локализация/логика)
    - `fieldErrors` — ошибки по полям для подсветки
  - почему так: grpc-gateway часто отдаёт `code` как число (grpc status), а UI нужны стабильные доменные коды
- **Product BFF** (`/api/platform/*`):
  - проксирует upstream ответ “как есть”
  - при `401` делает refresh+retry один раз
  - при недоступности upstream (например `ECONNREFUSED`) возвращает `502` с JSON:
    `{ message, code: "UPSTREAM_UNAVAILABLE", upstream }`

### Как это используется в UI

- `authApi` бросает `ApiError` при non-2xx (см. `src/entities/auth/api/authApi.ts`)
- `platformFetchJson` бросает `ApiError` при non-2xx (см. `src/shared/api/platformClient.ts`)
- UI/хуки могут показывать пользователю `err.message`, а при наличии `fieldErrors` — подсвечивать конкретные поля формы

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

пока никак

### Как работает logout

С точки зрения UI, logout — это простой вызов:

- `POST /api/auth/logout` (см. `src/entities/auth/api/authApi.ts`)

Что делает BFF на сервере (Next route handler `src/app/api/auth/logout/route.ts`):

- читает `hp_refresh_token` из httpOnly cookie
- делает `POST {AUTH_GATEWAY_BASE_URL}/v1/auth/logout` с `refresh_token`
- **в любом случае** очищает `hp_access_token` и `hp_refresh_token` (см. `clearAuthCookies()` в `src/shared/lib/auth/server.ts`)
- возвращает `{ ok: true }`

Ожидаемый эффект для приложения:

- следующий `GET /api/auth/session` вернёт `{ active: false }`
- UI обычно инвалидирует query `['auth','session']` и/или редиректит пользователя на `/login` (см. `src/features/auth/model/hooks.ts`)

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

---

## Авторизация и защита маршрутов

Приложение использует **3-уровневую систему защиты** для предотвращения несанкционированного доступа.

### 1. Middleware (Server Edge) 🛡️

**Файл:** `src/middleware.ts`

Проверяет наличие `hp_access_token` cookie **до рендера страницы**. Редиректит неавторизованных пользователей на `/auth/login`.

**Преимущества:**
- ✅ Нет мелькания контента
- ✅ Редирект на edge, до SSR
- ✅ Централизованный список защищенных маршрутов

**Добавление нового защищенного маршрута:**
```typescript
const protectedRoutes = [
  // ... существующие
  '/new-protected-page', // добавить сюда
]
```

### 2. Global Error Handler (Client) 🔄

**Файл:** `src/app/providers.tsx`

Перехватывает **все 401 ошибки** от API запросов (React Query) и автоматически редиректит на логин.

**Преимущества:**
- ✅ Работает для всех API запросов автоматически
- ✅ Не нужно проверять ошибки в каждом компоненте
- ✅ Обрабатывает истечение токена во время сессии

**Обрабатываемые коды:**
- `status === 401` (HTTP)
- `code === '16'` или `code === 'UNAUTHENTICATED'` (gRPC)

### 3. UI Level (Proactive) 🎨

**Файл:** `src/app/(app)/hackathons/page.tsx`

Проактивно скрывает или делает disabled недоступные элементы UI.

**Преимущества:**
- ✅ Лучший UX - не показываем недоступные действия
- ✅ Понятная обратная связь пользователю

### Централизованный конфиг маршрутов

**Файл:** `src/shared/config/routes.ts`

Все маршруты приложения в одном месте.

**Преимущества:**
- ✅ Типобезопасность
- ✅ Автокомплит в IDE
- ✅ Изменение URL в одном месте
- ✅ Динамические маршруты через функции

### Flowchart защиты

```
Пользователь → Middleware → AccessToken?
                    ↓              ↓
                   ❌            ✅
                    ↓              ↓
            Redirect /login    Render Page
                               ↓
                          API Request → 401?
                               ↓              ↓
                              ❌            ✅
                               ↓              ↓
                         Continue      Redirect /login
```
