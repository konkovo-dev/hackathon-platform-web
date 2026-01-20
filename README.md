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

## Темизация

Приложение поддерживает светлую и темную темы с использованием дизайн-токенов из `tokens.json`.

### Архитектура

**Текущий подход: CSS-переменные как единый источник правды**

```
tokens.json (исходные токены)
    ↓
globals.css (CSS переменные для обеих тем) ← ЕДИНСТВЕННЫЙ ИСТОЧНИК ПРАВДЫ
    ↓
tailwind.config.ts (маппинг в Tailwind классы)
    ↓
Компоненты (используют Tailwind классы)
```

### Как это работает

1. **CSS переменные**: Все цвета определены в `src/app/globals.css` как CSS переменные для обеих тем
2. **Tailwind интеграция**: Все токены доступны через классы Tailwind (например, `bg-bg-default`, `text-text-primary`)
3. **Автоматическая инициализация**: Тема загружается из `localStorage` или системных настроек до гидратации React (предотвращает мигание)
4. **Типобезопасность (опционально)**: Для использования цветов в JS/TS коде используйте `src/shared/config/tokens.ts`

### Использование

#### В Tailwind классах (рекомендуется)

```tsx
<div className="bg-bg-default text-text-primary border-border-default">
  <button className="bg-brand-primary text-text-inverse hover:bg-brand-primary-hover">
    Кнопка
  </button>
</div>
```

#### В TypeScript/JavaScript коде

Если нужно использовать цвета в JS (графики, canvas, инлайн-стили):

```tsx
import { getColorValue, getColorVar } from '@/shared/lib/tokens'

// Получить hex значение
const primaryColor = getColorValue('brand.primary') // '#4F46E5'

// Получить CSS переменную
const primaryVar = getColorVar('brand.primary') // 'var(--color-brand-primary)'

// Использование
<div style={{ backgroundColor: getColorValue('brand.primary') }}>
  Content
</div>
```

#### Переключение темы

Используйте компонент `ThemeToggle`:

```tsx
import { ThemeToggle } from '@/shared/ui/ThemeToggle'

export default function MyPage() {
  return (
    <div>
      <ThemeToggle />
    </div>
  )
}
```

#### Программное переключение

Используйте хук `useTheme`:

```tsx
'use client'

import { useTheme } from '@/shared/lib/theme'

export default function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme}>
      Текущая тема: {theme}
    </button>
  )
}
```

### Доступные токены

#### Цвета бренда
- `brand-primary`, `brand-primary-hover`, `brand-primary-active`
- `brand-secondary`, `brand-accent`

#### Фоны
- `bg-default`, `bg-surface`, `bg-elevated`, `bg-hover`, `bg-selected`

#### Текст
- `text-primary`, `text-secondary`, `text-tertiary`, `text-inverse`, `text-disabled`

#### Границы
- `border-default`, `border-strong`, `border-focus`, `divider`

#### Иконки
- `icon-primary`, `icon-secondary`

#### Состояния
- `state-success`, `state-warning`, `state-error`, `state-info`
- Каждое состояние имеет вариант с суффиксом `-bg` для фона

#### Статусы
- `status-new`, `status-in-progress`, `status-closed`, `status-draft`, и т.д.

#### Ссылки
- `link-default`, `link-hover`

### Typography токены

Все стили текста из `tokens.json` доступны через классы Tailwind или компонент `Typography`.

#### Доступные варианты

**Display:**
- `display-2xl`, `display-xl`

**Heading:**
- `heading-lg`, `heading-md`, `heading-sm`

**Title:**
- `title-lg`, `title-md`, `title-sm`

**Body:**
- `body-lg-regular`, `body-lg-medium`
- `body-md-regular`, `body-md-medium`
- `body-sm-regular`, `body-sm-medium`

**Label:**
- `label-lg`, `label-md`, `label-sm`, `label-xs`

**Caption:**
- `caption-sm-regular`, `caption-sm-medium`, `caption-xs`

**Overline:**
- `overline-xs`

**Code:**
- `code-sm`

### Примеры использования в Tailwind

```tsx
// Фон по умолчанию
<div className="bg-bg-default">

// Основной текст
<p className="text-text-primary">

// Брендовый цвет
<button className="bg-brand-primary text-text-inverse">

// Состояние успеха
<div className="bg-state-success-bg text-state-success">

// Граница фокуса
<input className="border-border-focus">
```

### Примеры использования Typography

#### Через Tailwind классы

```tsx
// Заголовок
<h1 className="typography-heading-lg">Заголовок</h1>

// Основной текст
<p className="typography-body-md-regular">Основной текст</p>

// Метка
<span className="typography-label-md">Метка</span>

// Код
<code className="typography-code-sm">const x = 1</code>
```

#### Через компонент Typography (рекомендуется)

```tsx
import { Typography } from '@/shared/ui/Typography'

// Автоматически выберет правильный HTML тег
<Typography variant="heading-lg">Заголовок</Typography>
<Typography variant="body-md-regular">Основной текст</Typography>

// Можно переопределить тег
<Typography variant="heading-lg" as="div">Заголовок в div</Typography>
```

### Структура файлов

```
src/
├── shared/
│   ├── config/
│   │   └── tokens.ts         # TypeScript конфигурация токенов (для JS/TS кода)
│   ├── lib/
│   │   ├── theme.ts          # Хук useTheme для работы с темой
│   │   └── tokens.ts         # Утилиты для работы с токенами в JS
│   └── ui/
│       ├── ThemeToggle.tsx   # Компонент переключения темы
│       └── Typography.tsx    # Компонент для типографики
└── app/
    ├── layout.tsx            # Инициализация темы через Script, подключение шрифтов
    └── globals.css           # ЕДИНСТВЕННЫЙ источник правды для CSS переменных (цвета + typography)
```

**Важно**: 
- `globals.css` — единственный источник правды для CSS переменных (используется Tailwind)
- `tokens.ts` — опциональный источник для типобезопасного доступа в JS/TS коде
- При изменении токенов из `tokens.json` обновляйте оба файла (или автоматизируйте через скрипт)

### Технические детали

- **Хранение**: Тема сохраняется в `localStorage` под ключом `hackathon-platform-theme`
- **Системные настройки**: Если тема не сохранена, используется системная настройка `prefers-color-scheme`
- **Атрибут темы**: Тема устанавливается через атрибут `data-theme` на элементе `<html>`
- **CSS переменные**: Все цвета определены как HSL значения для лучшей поддержки темной темы

## TODO

- [ ] Реализация API интеграции
- [ ] Аутентификация и авторизация
- [ ] Управление состоянием (без Redux)
- [ ] Realtime/WebSocket интеграция
- [ ] Роли и права доступа для sidebar в HackathonLayout
