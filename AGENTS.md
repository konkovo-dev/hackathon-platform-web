# Agent Guide: Hackathon Platform Web

Краткий справочник. Детальная документация: [`docs/`](docs/README.md)

## Быстрые команды

```bash
pnpm dev              # dev server
pnpm build            # production build
pnpm typecheck        # проверка типов TypeScript
pnpm lint             # ESLint + i18n:check + strings:check
pnpm test             # unit/integration тесты (Vitest)
pnpm test:e2e         # E2E тесты (Playwright)
pnpm api:gen          # генерация типов из OpenAPI
pnpm i18n:gen         # генерация типобезопасных ключей переводов
```

**Проверка перед коммитом:**

```bash
pnpm typecheck && pnpm lint && pnpm test
```

## Архитектура (FSD-lite)

Подробно: [`docs/architecture/README.md`](docs/architecture/README.md)

```
src/
├── app/              # Next.js App Router (роутинг + BFF в api/)
│   ├── (app)/**      # страницы с основным layout
│   ├── (auth)/**     # auth-страницы без Sidebar
│   └── api/**        # BFF route handlers (/api/auth/*, /api/platform/*)
├── shared/           # UI-примитивы, утилиты, конфиги, клиенты
├── entities/         # Доменные модели + API + policy
├── features/         # Сценарии (React Query hooks, формы, UI)
└── widgets/          # Композиции из features
```

**Правило:** `app/**` — только роутинг/layout; бизнес-логика в `entities/features/widgets`.

## Критичные правила

### 1. API-типы: только генерация

Подробно: [`docs/api/README.md`](docs/api/README.md)

- **Никогда не писать типы API вручную**
- `pnpm api:gen` → генерация из OpenAPI спецификаций
- Схемы: `src/shared/api/*.schema.ts` (не редактировать!)
- API использует **camelCase** (`firstName`, `catalogSkillIds`), не snake_case

### 2. i18n: запрет хардкода строк

Подробно: [`docs/i18n/README.md`](docs/i18n/README.md)

- В UI нельзя хардкодить строки (проверка: `pnpm strings:check`)
- Переводы: `src/shared/i18n/locales/{ru,en}/*.json`
- Типобезопасные ключи: `pnpm i18n:gen`

### 3. UI-компоненты: сначала проверить `shared/ui`

Перед написанием разметки проверить `src/shared/ui/index.ts`:

**Текущие компоненты:** `Avatar`, `Breadcrumb`, `Button`, `Checkbox`, `Chip`, `ChipList`, `FormField`, `Icon`, `InfoRow`, `Input`, `InputLabel`, `ListItem`, `Modal`, `Section`, `Switch`, `SwitchField`, `Tabs`, `Timeline`, `UserName`

**Куда класть новый компонент:**

| Что                                                     | Куда                                         |
| ------------------------------------------------------- | -------------------------------------------- |
| Примитив без бизнес-логики                              | `shared/ui/`                                 |
| Компонент с доменной логикой одной фичи                 | `features/<name>/ui/`                        |
| Композиция из нескольких фич                            | `widgets/`                                   |
| Специфичный для одной страницы, не переиспользуемый     | `features/<name>/ui/` или `app/`             |

### 4. Анимации: встроены в компоненты

Подробно: [`docs/motion/README.md`](docs/motion/README.md)

- Анимации **встроены** в базовые UI-компоненты
- Не прокидывать `className="animate-in fade-in ..."`
- Только enter-анимации (exit намеренно не используются)

### 5. Тестирование: обязательно для критичной логики

Подробно: [`docs/testing.md`](docs/testing.md)

- Unit: утилиты, policy (80%+)
- Integration: компоненты, hooks (60%+)
- E2E: только критичные флоу
- Colocation: тесты рядом с кодом (`.test.ts`, `.test.tsx`)

## Auth & API

**Auth (BFF + httpOnly cookies):**

- UI → `/api/auth/*` → auth gateway → cookies (`hp_access_token`, `hp_refresh_token`)
- Ключевые файлы:
  - `src/shared/lib/auth/server.ts` — работа с cookies
  - `src/app/api/auth/*/route.ts` — BFF handlers

**Product API (через `/api/platform/*`):**

- UI → `/api/platform/*` → продуктовый API (с `Authorization` из cookie)
- На `401`: refresh + retry (1 раз)
- `src/app/api/platform/[...path]/route.ts` — прокси

Переменные окружения: `.env.example`

## Policy / Access Control

Подробно: [`docs/access-control/README.md`](docs/access-control/README.md)

- `useCan(action, params?)` — проверка доступа
- `<AccessGate decision={...}>` — условный рендеринг
- Примеры: `src/entities/team/policy/teamPolicy.ts`, `src/entities/hackathon/policy/hackathonPolicy.ts`

## Типовые грабли

- После изменения роутов в `src/app/**` удалить `.next/` и перезапустить `pnpm dev`
- При добавлении нового примитива в `shared/ui/` — обязательно экспортировать через `index.ts`
- Перед коммитом: `pnpm typecheck && pnpm lint && pnpm test`

---

**Документация:** [`docs/`](docs/README.md) | **Быстрый старт:** [`docs/getting-started/README.md`](docs/getting-started/README.md)
