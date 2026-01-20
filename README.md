# Hackathon Platform Web

Веб-приложение для платформы проведения хакатонов.

## Технологии

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **TanStack Query** (React Query)
- **openapi-typescript** + **openapi-fetch** (типизированный REST API)
- **pnpm** (менеджер пакетов)

## Архитектура FSD-lite

Проект использует упрощенную версию Feature-Sliced Design:

### Структура слоев

```
src/
├── app/              # Роутинг и layout'ы Next.js
│                     # НЕ содержит бизнес-логики, только маршрутизация
│
├── shared/           # Переиспользуемый код
│   ├── api/          # API клиент, типы, обработка ошибок
│   ├── ui/           # Базовые UI компоненты (Button, Input, Card и т.д.)
│   ├── lib/          # Утилиты (cn, форматирование и т.д.)
│   └── config/       # Конфигурация (env, константы)
│
├── entities/         # Бизнес-сущности (User, Hackathon, Team и т.д.)
│                     # Содержит модели данных, типы, базовые компоненты
│
├── features/         # Функциональные возможности
│                     # Содержит логику конкретных фич (login, create-team и т.д.)
│
└── widgets/          # Композиции features и entities
                      # Сложные составные компоненты (Header, Sidebar и т.д.)
```

### Правила

1. **app/** — только роутинг и layout'ы. Бизнес-логика не должна быть здесь.
2. **shared/** — переиспользуемый код без бизнес-логики.
3. **entities/** — изолированные бизнес-сущности, не зависят от features/widgets.
4. **features/** — могут использовать entities и shared, но не другие features.
5. **widgets/** — могут использовать features, entities и shared.

### Импорты

- Используйте алиас `@/` для импортов из `src/`
- Пример: `import { Button } from '@/shared/ui/Button'`

## Установка и запуск

```bash
# Установка зависимостей
pnpm install

# Запуск dev сервера
pnpm dev

# Сборка проекта
pnpm build

# Запуск production сервера
pnpm start
```

## Скрипты

- `pnpm dev` — запуск dev сервера
- `pnpm build` — сборка проекта
- `pnpm start` — запуск production сервера
- `pnpm lint` — проверка кода ESLint
- `pnpm format` — форматирование кода Prettier
- `pnpm typecheck` — проверка типов TypeScript
- `pnpm api:gen` — генерация типов из OpenAPI схемы

## Генерация типов API

Для генерации типов из OpenAPI схемы:

1. Установите переменную окружения `OPENAPI_URL`:

   ```bash
   export OPENAPI_URL=https://api.example.com/openapi.json
   ```

2. Запустите генерацию:
   ```bash
   pnpm api:gen
   ```

Типы будут сгенерированы в `src/shared/api/schema.ts`.

## Переменные окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
OPENAPI_URL=https://api.example.com/openapi.json
```

## Структура страниц

- `/` — главная страница (лендинг)
- `/login` — страница входа
- `/register` — страница регистрации
- `/hackathons` — список хакатонов
- `/hackathons/[hackathonId]` — страница хакатона (с sidebar)
- `/profile` — профиль пользователя
- `/invitations` — приглашения в команды
- `/my-teams` — мои команды

## TODO

- [ ] Реализация API интеграции
- [ ] Аутентификация и авторизация
- [ ] Управление состоянием (без Redux)
- [ ] Realtime/WebSocket интеграция
- [ ] Роли и права доступа для sidebar в HackathonLayout
