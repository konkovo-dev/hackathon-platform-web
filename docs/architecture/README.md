# Архитектура (FSD-lite)

Проект использует упрощённую версию Feature-Sliced Design.

## Структура слоёв

```
src/
├── app/              # Роутинг и layout'ы Next.js (без бизнес-логики)
├── shared/           # Переиспользуемый код (ui, lib, config, api)
├── entities/         # Бизнес-сущности
├── features/         # Фичи (сценарии + hooks + UI)
└── widgets/          # Композиции (составные блоки)
```

## Правила

1. `app/**` — только роутинг/layout; сетевые вызовы и бизнес-логика выносятся в `features/entities`.
2. `shared/**` — переиспользуемое; не знает про конкретные бизнес-сущности.
3. `entities/**` — доменные модели/DTO/доменные API функции; не зависит от `features/widgets`.
4. `features/**` — использует `entities` и `shared`, но не другие `features`.
5. `widgets/**` — собирает `features/entities/shared`.

## Импорты

Используйте алиас `@/` для импортов из `src/`:

- пример: `import { Button } from '@/shared/ui/Button'`

## Структура страниц

- `/` — главная (лендинг)
- `/login` — вход
- `/register` — регистрация
- `/hackathons` — список хакатонов
- `/hackathons/[hackathonId]` — страница хакатона (с sidebar)
- `/profile` — профиль
- `/invitations` — приглашения
- `/my-teams` — мои команды

