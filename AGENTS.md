# Agent Guide: Hackathon Platform Web

Этот файл предназначен для AI-агентов и новых разработчиков: где что лежит, какие правила важны, куда добавлять код.

## Быстрые команды

- `pnpm dev` — dev server
- `pnpm typecheck` — TypeScript check
- `pnpm lint` — ESLint + `i18n:check` + `strings:check`
- `pnpm api:gen` — генерация типов из OpenAPI

## Архитектура (FSD-lite)

Код живёт в `src/`:

- `src/app/**` — Next.js App Router
  - `src/app/(app)/**` — основной layout приложения (с `Sidebar`)
  - `src/app/(auth)/**` — auth-страницы без `Sidebar`
  - `src/app/api/**` — BFF route handlers
- `src/shared/**` — базовые утилиты/конфиги/UI/клиенты
- `src/entities/**` — доменные модели + API функции + policy по сущностям
- `src/features/**` — сценарии и UI фич (хуки React Query, формы и т.п.)
- `src/widgets/**` — композиции (например `Sidebar`)

Правило: в `app/**` **нет** бизнес-логики, кроме BFF route handlers.

## Auth (BFF + httpOnly cookies)

Поток:

- UI ходит в `/api/auth/*` (см. `src/entities/auth/api/authApi.ts`)
- Next route handlers проксируют на auth gateway и пишут токены в httpOnly cookies:
  - `hp_access_token`
  - `hp_refresh_token`

Ключевые файлы:

- `src/shared/lib/auth/server.ts` — работа с cookies
- `src/shared/lib/auth/proxyAuthGateway.ts` — server-only клиент auth gateway
- `src/features/auth/model/hooks.ts` — React Query хуки для auth
- `src/entities/auth/model/server.ts` — `getServerSession()` для SSR

## Product API (через /api/platform/*)

Почему так: access token хранится в httpOnly cookie и не доступен из JS, поэтому продуктовые запросы идут через BFF.

- Браузер: запросы в `/api/platform/*`
- Сервер (Next): проксирует на `PLATFORM_API_BASE_URL`, подставляя `Authorization`
- На `401`: делает refresh и повторяет запрос 1 раз

Файлы:

- `src/app/api/platform/[...path]/route.ts` — прокси + refresh+retry
- `src/shared/api/platformClient.ts` — `platformFetchJson()` (минимальный клиент для entities)

Переменные окружения:

- `PLATFORM_API_BASE_URL` — base url продуктового API (server-only)
- `AUTH_GATEWAY_BASE_URL` — base url auth gateway (server-only)
 

## Policy / Access Control

Цель: не разносить проверки ролей/стадий по UI, а выражать доступ через actions + policy.

Текущий каркас:

- `src/shared/policy/decision.ts` — `Decision`, `ReasonCode`
- `src/shared/policy/useCan.ts` — `useCan(action, params?)`
- `src/shared/policy/AccessGate.tsx` — gate по уже вычисленному `decision`
- `src/entities/hackathon-context/**` — типы + `useHackathonContextQuery(hackathonId)`
- Примеры:
  - `src/entities/team/policy/teamPolicy.ts` (`Team.Create`)
  - `src/entities/hackathon/policy/hackathonPolicy.ts` (`Hackathon.ReadDraft`)

## i18n и запрет “сырого” текста

В UI (кроме `src/app/design-system/**`) нельзя хардкодить строки.

- Проверка: `pnpm strings:check`
- Переводы: `src/shared/i18n/locales/{ru,en}/*.json`
- Типобезопасные ключи: `pnpm i18n:gen` → `src/shared/i18n/generated.ts`

## Типовые грабли

- После переноса роутов в `src/app/**` Next может оставить устаревшие типы в `.next/types`.
  - Фикс: удалить `.next` и перезапустить `pnpm dev` или `pnpm typecheck`.
