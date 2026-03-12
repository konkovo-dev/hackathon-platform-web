# Локализация (i18n) и запрет “сырого” текста

Проект использует типобезопасную локализацию без внешних библиотек, совместимую с Next.js App Router (SSR + CSR).

## Как устроено

- **Переводы**: `src/shared/i18n/locales/{ru,en}/{namespace}.json`
- **Неймспейсы**: `src/shared/i18n/config.ts` (например: `common`, `auth`, `home`)
- **Генерация ключей**: `pnpm i18n:gen` → `src/shared/i18n/generated.ts`
- **Хранение языка**: cookie `hp_locale` (1 год)
- **SSR**: `src/shared/i18n/server.ts` (`getServerMessages`, `getServerI18n`)
- **CSR**: `src/shared/i18n/I18nProvider.tsx` + `useT()`

## Использование

### На сервере (server components)

```tsx
import { getServerI18n } from '@/shared/i18n/server'

export default async function Page() {
  const { t } = await getServerI18n(['auth', 'common'])
  return <h1>{t('auth.title')}</h1>
}
```

### На клиенте (client components)

```tsx
'use client'

import { useT } from '@/shared/i18n/useT'

export function MyWidget() {
  const t = useT()
  return <button>{t('common.actions.login')}</button>
}
```

### Интерполяция параметров

Система поддерживает интерполяцию переменных в строках перевода:

**В JSON файлах** используйте `{имя_параметра}` (одинарные фигурные скобки):

```json
{
  "welcome": "Добро пожаловать, {name}!",
  "teamSize": "до {count} человек"
}
```

**В коде** передайте параметры вторым аргументом:

```tsx
const t = useT()

// Простая интерполяция
t('common.welcome', { name: 'Иван' }) // → "Добро пожаловать, Иван!"

// С числами
t('hackathons.card.teamSize', { count: 5 }) // → "до 5 человек"
```

## Переключение языка

Переключение языка находится в сайдбаре (settings panel: **“язык”**).

## Правило: запрет “сырого” текста в UI

Проверка `pnpm strings:check` (входит в `pnpm lint`):

- сканирует `src/app`, `src/features`, `src/widgets`, `src/entities`
- ругается на текст в JSX (`<div>Текст</div>`) и на строковые JSX-атрибуты (например `aria-label="..."`)
- исключение: `src/app/design-system/`** (демо)

