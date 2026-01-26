# Темизация

Приложение поддерживает светлую и тёмную темы на базе дизайн-токенов из `tokens.json`.

## Архитектура

Единый источник правды — CSS переменные в `src/app/globals.css`.

```
tokens.json (исходные токены)
    ↓
globals.css (CSS переменные для обеих тем) ← единый источник правды
    ↓
tailwind.config.ts (маппинг в Tailwind классы)
    ↓
Компоненты (Tailwind классы)
```

## Как это работает

- Тема хранится в `localStorage` под ключом `hackathon-platform-theme`
- Тема применяется на `<html>` через атрибут `data-theme`
- Инициализация делается **до гидратации React** в `src/app/layout.tsx` (через `next/script`)

## Использование

### В Tailwind классах

Пример:

```tsx
<div className="bg-bg-default text-text-primary border-border-default">
  <button className="bg-brand-primary text-text-inverse hover:bg-brand-primary-hover">
    ...
  </button>
</div>
```

### Переключение темы

Переключение темы находится в сайдбаре (settings panel: **“темная тема”**).
