# Agent Guide: Hackathon Platform Web

Этот файл предназначен для AI-агентов и новых разработчиков: где что лежит, какие правила важны, куда добавлять код.

## Быстрые команды

- `pnpm dev` — dev server
- `pnpm typecheck` — TypeScript check
- `pnpm lint` — ESLint + `i18n:check` + `strings:check`
- `pnpm test` — запуск всех unit/integration тестов
- `pnpm api:gen` — генерация типов из OpenAPI

## Проверки после каждого изменения

**Обязательно запускать перед коммитом:**

1. **`pnpm typecheck`** — проверка типов TypeScript
2. **`pnpm lint`** — комплексная проверка качества кода
3. **`pnpm test`** — запуск всех тестов

**При изменении API-типов:**

- `pnpm api:gen` — регенерация типов из OpenAPI (если обновился spec)
- `pnpm i18n:gen` — регенерация типобезопасных ключей переводов (если добавились новые ключи)

**Итоговая проверка перед коммитом:**

```bash
pnpm typecheck && pnpm lint && pnpm test
```

Все три команды должны выполниться успешно (exit code 0).

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

## Product API (через /api/platform/\*)

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

## Декомпозиция UI

### Куда класть компонент

| Что                                                                                                                       | Куда                                     |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Примитив без бизнес-логики (кнопка, поле, чип, аватар)                                                                    | `shared/ui/`                             |
| Паттерн из нескольких примитивов без доменного смысла (модал с заголовком, переключатель с подписью, строка-пункт списка) | `shared/ui/`                             |
| Компонент с доменной логикой одной фичи (форма редактирования профиля, модал навыков)                                     | `features/<name>/ui/`                    |
| Компонент, который собирает несколько фич и отображается на нескольких страницах                                          | `widgets/`                               |
| Компонент, специфичный ровно для одной страницы и не переиспользуемый                                                     | `features/<name>/ui/` или прямо в `app/` |

### Правило: сначала проверить `shared/ui`

Перед тем как писать разметку в feature-компоненте, проверить — нет ли в `shared/ui` подходящего примитива. Весь `shared/ui` экспортируется через `src/shared/ui/index.ts`.

Текущая палитра:

| Компонент        | Назначение                                                            |
| ---------------- | --------------------------------------------------------------------- |
| `Avatar`         | Аватар с fallback-инициалой                                           |
| `Button`         | Кнопка (`primary`, `secondary`, `action`, `secondary-action`, `icon`) |
| `Checkbox`       | Чекбокс                                                               |
| `Chip`           | Pill-тег с опциональными иконкой, кнопкой удаления и href             |
| `ChipList`       | Flex-обёртка для списка чипов с gap-m4                                |
| `FormField`      | Обёртка для поля ввода с label и ошибкой                              |
| `Icon`           | SVG-иконка через CSS mask                                             |
| `Input`          | Поле ввода (`text`, `search`)                                         |
| `InputLabel`     | Подпись к полю                                                        |
| `Modal`          | Модальное окно с backdrop, Escape и анимацией                         |
| `Section`        | Bordered-секция с title и опциональным action-слотом                  |
| `SelectListItem` | Выбираемая строка списка с индикатором выбора                         |
| `Switch`         | Переключатель                                                         |
| `SwitchField`    | Переключатель с подписью                                              |
| `UserName`       | Отображение имени пользователя: «Имя Фамилия / @username»             |

### Когда выносить новый компонент в `shared/ui`

Вынести если:

- паттерн встречается в двух и более местах (даже в разных фичах), **или**
- он не содержит доменных типов и переводов (ничего из `entities/`, ничего из i18n-неймспейса фичи), **или**
- он напрямую соответствует компоненту в Figma — проверить имя слоя (Section, ListItem, Chip, ProfileImage и т.п.)

Оставить в feature если компонент:

- знает о доменных типах (`MeUser`, `Skill`, `Team` и т.п.)
- использует ключи i18n конкретного неймспейса (`profile.*`, `teams.*`)
- вызывает хуки данных (`useProfileQuery`, `useTeamQuery`)

### Чего не делать

- **Не дублировать разметку** — если один и тот же `div` с одинаковыми классами встречается дважды, это кандидат для компонента
- **Не хардкодить структуру**, которая уже есть в `shared/ui`: footer с cancel/save — это `ModalActions`, bordered-секция с заголовком — это `Section`, и т.д.
- **Не экспортировать компонент только из файла** — всё, что создаётся в `shared/ui/`, обязательно добавляется в `shared/ui/index.ts`

## Анимации

Анимации — часть дизайна компонента и должны быть **встроены** в базовые UI-компоненты, а не прокидываться через `className`.

### Принципы

**✅ Правильно:**

```tsx
// Анимация встроена в компонент
<Chip label="React" />
<Section title="Контакты">...</Section>
```

**❌ Неправильно:**

```tsx
// Анимация прокидывается извне — дублирование, хрупкость
<Chip label="React" className="animate-in fade-in zoom-in-95 duration-150" />
```

### Где встраивать анимации

| Компонент        | Анимация                                                                                                               | Механизм                                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `Chip`           | `animate-in fade-in zoom-in-95 duration-150`                                                                           | Встроена в `baseClass`                        |
| `Avatar`         | `animate-in fade-in zoom-in-95 duration-200`                                                                           | Встроена в container `div`                    |
| `Section`        | `animate-in fade-in slide-in-from-bottom-2 duration-200`                                                               | Встроена в root `div`                         |
| `Modal`          | `animate-in fade-in duration-200` (backdrop)<br/>`animate-in zoom-in-95 slide-in-from-bottom-4 duration-200` (content) | Встроена в backdrop и content                 |
| `Button`         | `transition-all duration-150`                                                                                          | Встроена в `baseClassName` для hover/active   |
| `Input`          | `transition-all duration-150`                                                                                          | Встроена в container для focus                |
| `Switch`         | `transition-all duration-200`                                                                                          | Встроена в track + thumb                      |
| `SelectListItem` | `transition-all duration-150`                                                                                          | Встроена в root, checkmark имеет `animate-in` |

### Важно: только enter-анимации

Exit-анимации **намеренно не используются**, потому что:

- Они усложняют код (нужны useState, useRef, setTimeout)
- Создают баги с unmount'ом children

**Принцип**: элементы плавно появляются, исчезают мгновенно. Это проще, надежнее и достаточно для хорошего UX.

### Доступные утилиты (tailwind.config.ts)

**Базовые классы:**

- `animate-in` / `animate-out` — запуск анимации появления/исчезновения
- `fade-in` / `fade-out` — изменение прозрачности
- `zoom-in-95` / `zoom-in-90` / `zoom-out-95` — масштабирование
- `slide-in-from-bottom-2` / `slide-in-from-bottom-4` — слайд снизу (0.5rem / 1rem)
- `duration-75` / `duration-100` / `duration-150` / `duration-200` / `duration-300` и т.д.

**Для transitions:**

- `transition-all duration-150` — универсальный плавный переход (hover, active, focus)
- `transition-colors` / `transition-opacity` / `transition-transform` — специфичные

### Правила

1. **Инкапсуляция** — анимация = часть компонента, а не внешняя конфигурация
2. **Единообразие** — все экземпляры компонента анимируются одинаково
3. **Оптимизация** — короткие анимации (75-200ms) для интерактива, средние (200-300ms) для модалов
4. **Композиция** — комбинируй эффекты: `fade-in zoom-in-95` богаче, чем просто `fade-in`
5. **transition-all** — для hover/active/focus с изменением нескольких свойств одновременно

## i18n и запрет “сырого” текста

В UI (кроме `src/app/design-system/**`) нельзя хардкодить строки.

- Проверка: `pnpm strings:check`
- Переводы: `src/shared/i18n/locales/{ru,en}/*.json`
- Типобезопасные ключи: `pnpm i18n:gen` → `src/shared/i18n/generated.ts`

## Генерация API-типов

**Правило: никогда не писать типы API вручную.** Все типы запросов и ответов берутся из сгенерированных схем.

### Как устроено

- Инструмент: `openapi-typescript` (запускается через `pnpm api:gen`)
- Конфиг: `openapi/openapi.config.json` — список генераторов: `{ name, input, output }`
- Сгенерированные файлы: `src/shared/api/*.schema.ts` — **не редактировать вручную**

### Как добавить типы для нового сервиса

1. Найти Swagger/OpenAPI spec сервиса в `../hackaton-platform-api/internal/gateway/swagger/`
2. Если Swagger 2.0 (поле `"swagger": "2.0"`) — сконвертировать в OpenAPI 3.0:
   ```
   npx swagger2openapi <source.swagger.json> -o openapi/<name>.openapi.yaml
   ```
3. Добавить запись в `openapi/openapi.config.json`:
   ```json
   {
     "name": "<name>",
     "input": "./openapi/<name>.openapi.yaml",
     "output": "./src/shared/api/<name>.schema.ts"
   }
   ```
4. Запустить `pnpm api:gen`
5. В `entities/<domain>/model/types.ts` импортировать и переэкспортировать нужные типы под именами приложения:
   ```ts
   import type { components } from '@/shared/api/<name>.schema'
   export type MyType = components['schemas']['v1MyType']
   ```

### Важно про camelCase

API (gRPC-gateway с `json_names_for_fields=true`) всегда использует **camelCase** в JSON — `firstName`, `catalogSkillIds`, `contactsVisibility`. Имена полей в сгенерированной схеме всегда правильные. При ручном написании тел запросов легко ошибиться и использовать snake_case — **всегда сверяться со схемой**.

### Текущие схемы

| Файл схемы                 | Источник                               | Сервис                  |
| -------------------------- | -------------------------------------- | ----------------------- |
| `authGateway.schema.ts`    | `openapi/auth-gateway.openapi.yaml`    | Auth Gateway            |
| `authBff.schema.ts`        | `openapi/auth-bff.openapi.yaml`        | Auth BFF                |
| `identityMe.schema.ts`     | `openapi/identity-me.openapi.yaml`     | Identity Me-service     |
| `identitySkills.schema.ts` | `openapi/identity-skills.openapi.yaml` | Identity Skills-service |

## Profile Feature

Профиль реализован по FSD-lite: entity → feature → page.

### entities/user/

- `model/types.ts` — переэкспорт типов из `identityMe.schema.ts` под именами приложения: `MeProfile`, `MeUser`, `Skill`, `ContactType`, `VisibilityLevel` и др., плюс утилиты `getSkillName()`, `getContactTypeLabel()`
- `api/getMe.ts` — `getMe(): Promise<MeProfile>` — `GET /v1/users/me`
- `api/updateMe.ts` — `updateMe(input)` — `PUT /v1/users/me` (camelCase: `firstName`, `lastName`, `timezone`, `avatarUrl`)
- `api/updateMySkills.ts` — `updateMySkills(input)` — `PUT /v1/users/me/skills` (camelCase: `userSkills[]`, `catalogSkillIds[]`, `skillsVisibility`)
- `api/updateMyContacts.ts` — `updateMyContacts(input)` — `PUT /v1/users/me/contacts` (camelCase: `contacts[]`, `contactsVisibility`)

### features/profile/

- `model/hooks.ts` — React Query хуки:
  - `useProfileQuery(initialData?)` — `staleTime: 60_000`
  - `useUpdateProfileMutation()`, `useUpdateSkillsMutation()`, `useUpdateContactsMutation()`
- `ui/ProfileClient.tsx` — главный клиентский компонент страницы (принимает `initialData` от SSR)
- `ui/EditNameSection.tsx` — inline-редактирование имени и фамилии
- `ui/EditSkillsModal.tsx` — модальное окно редактирования навыков (поиск + выбор + видимость)
- `ui/EditContactsModal.tsx` — модальное окно редактирования контактов (email, github, telegram, linkedin)

### shared/ui/

- `Chip.tsx` — pill-компонент: `label`, опциональные `icon`, `onRemove`, `onClick`
- `Modal.tsx` — оверлей с backdrop и Escape-клавишей: `open`, `onClose`, `title`, `children`

### Identity Policy (из API-спецификации)

- `Identity.ReadMe` — `auth && is_me` — полный профиль (все поля)
- `Identity.ReadUser` — `auth && !is_me` — публичные поля + условные (skills/contacts по видимости)
- `Identity.UpdateMe.Profile` — `auth && is_me` — first_name, last_name, timezone, avatar_url (username неизменяем)
- `Identity.UpdateMe.Skills` — `auth && is_me` — skills + skills_visibility
- `Identity.UpdateMe.Contacts` — `auth && is_me` — contacts + contacts_visibility + per_contact_visibility

## Тестирование

**Правило: тесты обязательны для всей критичной логики.** Unit-тесты для утилит и policy, integration-тесты для компонентов и features.

### Быстрые команды

- `pnpm test` — запуск всех unit/integration тестов (Vitest)
- `pnpm test:watch` — watch mode для разработки
- `pnpm test:coverage` — coverage report
- `pnpm test:e2e` — E2E тесты (Playwright)
- `pnpm test:e2e:ui` — Playwright UI mode

### Стек

- **Vitest** — unit/integration тесты (быстрее Jest, нативный ESM/TypeScript)
- **@testing-library/react** — тестирование React-компонентов
- **MSW** — моки API (Mock Service Worker)
- **Playwright** — E2E тесты

### Архитектура тестов

**Colocation** — тесты лежат рядом с кодом:

```
src/entities/user/
  model/
    types.ts
    types.test.ts          # unit: утилиты getSkillName, getContactTypeLabel
  api/
    getMe.ts
    getMe.test.ts          # unit: API функции
  policy/
    userPolicy.ts
    userPolicy.test.ts     # unit: policy rules

src/features/profile/ui/
  EditNameSection.tsx
  EditNameSection.test.tsx # integration: компонент + взаимодействия

src/shared/ui/
  Button.tsx
  Button.test.tsx          # integration: UI примитив
```

**Централизованная папка `tests/`** для общих ресурсов:

```
tests/
  setup/
    vitest.setup.ts        # глобальный setup (MSW, matchers)
    msw.ts                 # MSW handlers
    test-utils.tsx         # renderWithProviders
  fixtures/
    mockUser.ts            # переиспользуемые моки
    mockSkills.ts
  e2e/
    profile.spec.ts        # Playwright E2E
```

### Что тестировать

| Тип теста       | Что                                   | Где           | Пример                                                   |
| --------------- | ------------------------------------- | ------------- | -------------------------------------------------------- |
| **Unit**        | Утилиты, хелперы, валидаторы, policy  | Рядом с кодом | `getSkillName()`, `cn()`, `teamPolicy.canCreate()`       |
| **Integration** | React-компоненты, hooks, формы        | Рядом с кодом | `<Button />`, `useProfileQuery()`, `<EditNameSection />` |
| **E2E**         | Критичные флоу (регистрация, профиль) | `tests/e2e/`  | Регистрация → вход → редактирование профиля              |

### Важные правила

1. **Не тестировать реализацию** — тестируй публичный API, а не internal детали
2. **Использовать fixtures** — не дублировать моки, переиспользовать из `tests/fixtures/`
3. **Изолировать тесты** — каждый тест независим, порядок выполнения не важен
4. **Минимум E2E** — только критичные пользовательские сценарии (E2E медленные и хрупкие)
5. **MSW для моков** — не мокать `fetch` напрямую, использовать MSW handlers

### Coverage цели

- **Unit** (shared/lib, entities/\*/model): 80%+
- **Integration** (features, shared/ui): 60%+
- **E2E**: критичные флоу

Подробная документация: `docs/testing.md`

## Типовые грабли

- После переноса роутов в `src/app/**` Next может оставить устаревшие типы в `.next/types`.
  - Фикс: удалить `.next` и перезапустить `pnpm dev` или `pnpm typecheck`.
