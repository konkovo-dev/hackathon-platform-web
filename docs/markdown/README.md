# Markdown в Hackathon Platform

Универсальный механизм для написания и рендеринга Markdown-контента в приложении.

## Оглавление

- [Обзор](#обзор)
- [Компоненты](#компоненты)
  - [MarkdownContent](#markdowncontent)
  - [MarkdownEditor](#markdowneditor)
- [Использование](#использование)
- [Поддерживаемый синтаксис](#поддерживаемый-синтаксис)
- [Стилизация](#стилизация)
- [Расширение функционала](#расширение-функционала)

## Обзор

Механизм Markdown предоставляет два основных компонента:

1. **`MarkdownContent`** - компонент для рендеринга Markdown в читаемый HTML
2. **`MarkdownEditor`** - split-view редактор с live preview для написания Markdown

Оба компонента полностью интегрированы с дизайн-системой приложения и используют design tokens (цвета, типографика, отступы).

### Используемые библиотеки

- **react-markdown** (v10.1.0) - безопасный рендеринг Markdown в React компоненты
- **remark-gfm** (v4.0.1) - поддержка GitHub Flavored Markdown (таблицы, strikethrough, task lists)

## Компоненты

### MarkdownContent

Компонент для рендеринга Markdown-текста с применением стилей дизайн-системы.

#### Использование

```tsx
import { MarkdownContent } from '@/shared/ui/MarkdownContent'

function HackathonDescription({ description }: { description: string }) {
  return (
    <div>
      <h2>Описание</h2>
      <MarkdownContent>{description}</MarkdownContent>
    </div>
  )
}
```

#### Props

| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `children` | `string` | ✅ | Markdown-текст для рендеринга |
| `className` | `string` | ❌ | Дополнительные CSS классы для обёртки |

#### Примеры

```tsx
// Базовое использование
<MarkdownContent>
  {`# Заголовок\n\nПростой текст с **жирным** и *курсивом*.`}
</MarkdownContent>

// С кастомным className
<MarkdownContent className="my-custom-wrapper">
  {markdownText}
</MarkdownContent>

// Вложенный в Section
<Section title="Описание">
  <MarkdownContent>{hackathon.description}</MarkdownContent>
</Section>
```

---

### MarkdownEditor

Split-view редактор с live preview для написания Markdown. Слева - textarea для ввода, справа - отрисованный preview.

#### Использование

```tsx
import { MarkdownEditor } from '@/shared/ui/MarkdownEditor'

function HackathonForm() {
  const [description, setDescription] = useState('')

  return (
    <MarkdownEditor
      value={description}
      onChange={setDescription}
      placeholder="Опишите ваш хакатон"
    />
  )
}
```

#### Props

| Prop | Тип | Обязательный | По умолчанию | Описание |
|------|-----|--------------|--------------|----------|
| `value` | `string` | ✅ | - | Текущее значение Markdown |
| `onChange` | `(value: string) => void` | ✅ | - | Callback для изменения значения |
| `placeholder` | `string` | ❌ | `t('common.markdown.placeholder')` | Placeholder текст |
| `disabled` | `boolean` | ❌ | `false` | Отключить редактирование |
| `error` | `boolean` | ❌ | `false` | Показать состояние ошибки |
| `rows` | `number` | ❌ | `6` | Количество строк textarea |
| `className` | `string` | ❌ | - | Дополнительные CSS классы |

#### Примеры

```tsx
// Базовое использование
<MarkdownEditor
  value={description}
  onChange={setDescription}
/>

// В форме с валидацией
<MarkdownEditor
  value={description}
  onChange={setDescription}
  placeholder={t('hackathons.create.fields.description')}
  disabled={isPending}
  error={fieldErrors.description}
/>

// С кастомной высотой
<MarkdownEditor
  value={announcement}
  onChange={setAnnouncement}
  rows={10}
/>
```

---

## Поддерживаемый синтаксис

### Базовый Markdown

| Синтаксис | Пример | Результат |
|-----------|--------|-----------|
| Заголовки | `# H1`, `## H2`, `### H3` | <h1>H1</h1>, <h2>H2</h2>, <h3>H3</h3> |
| Жирный | `**bold**` | **bold** |
| Курсив | `*italic*` | *italic* |
| Ссылки | `[text](url)` | [text](url) |
| Inline код | `` `code` `` | `code` |
| Блок кода | ` ```js\ncode\n``` ` | ```js\ncode\n``` |
| Списки | `- item` или `1. item` | • item или 1. item |
| Цитаты | `> quote` | > quote |
| Горизонтальная линия | `---` | --- |

### GitHub Flavored Markdown (GFM)

| Функция | Синтаксис | Пример |
|---------|-----------|--------|
| Зачёркнутый текст | `~~text~~` | ~~text~~ |
| Таблицы | `\| Header \| Header \|`<br/>`\| ------ \| ------ \|`<br/>`\| Cell   \| Cell   \|` | Таблица |
| Task lists | `- [ ] Task`<br/>`- [x] Done` | ☐ Task<br/>☑ Done |

---

## Стилизация

Все элементы Markdown стилизованы с использованием design tokens приложения.

### Типографика

```tsx
h1 → typography-heading-lg
h2 → typography-heading-md
h3 → typography-heading-sm
h4 → typography-title-lg
h5 → typography-title-md
h6 → typography-title-sm
p  → typography-body-md-regular
code → typography-code-sm
```

### Цвета

```tsx
// Текст
text-text-primary    // основной текст
text-text-secondary  // цитаты, strikethrough
text-text-tertiary   // placeholder

// Ссылки
text-link-default hover:text-link-hover

// Фон
bg-bg-elevated  // inline code
bg-bg-surface   // code blocks, таблицы

// Границы
border-border-default  // таблицы, code blocks
border-border-strong   // цитаты
```

### Отступы

Все отступы используют spacing tokens (`m2`, `m4`, `m6`, `m8` и т.д.) из дизайн-системы.

---

## Тестирование

### Unit-тесты

Оба компонента покрыты unit-тестами:

- `src/shared/ui/MarkdownContent/MarkdownContent.test.tsx` (18 тестов)
- `src/shared/ui/MarkdownEditor/MarkdownEditor.test.tsx` (12 тестов)

```bash
# Запуск тестов
pnpm test MarkdownContent
pnpm test MarkdownEditor
```

### Примеры тестирования

```tsx
import { render, screen } from '@testing-library/react'
import { MarkdownContent } from '@/shared/ui/MarkdownContent'

it('renders markdown correctly', () => {
  render(<MarkdownContent># Heading</MarkdownContent>)
  
  const heading = screen.getByRole('heading', { level: 1 })
  expect(heading).toHaveTextContent('Heading')
})
```

---

## Расширение функционала

### Добавление новых элементов

Для кастомизации рендеринга элементов, отредактируйте `components` в `MarkdownContent.tsx`:

```tsx
<ReactMarkdown
  components={{
    // Добавьте свой компонент
    img: ({ node, ...props }) => (
      <img
        className="max-w-full h-auto rounded-md"
        loading="lazy"
        {...props}
      />
    ),
  }}
>
  {children}
</ReactMarkdown>
```

### Добавление плагинов

Для расширения синтаксиса добавьте remark/rehype плагины:

```bash
pnpm add remark-math rehype-katex
```

```tsx
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

<ReactMarkdown
  remarkPlugins={[remarkGfm, remarkMath]}
  rehypePlugins={[rehypeKatex]}
>
  {children}
</ReactMarkdown>
```

### Toolbar для MarkdownEditor

Для добавления панели инструментов создайте компонент `MarkdownToolbar`:

```tsx
interface MarkdownToolbarProps {
  onInsert: (text: string) => void
}

function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  return (
    <div className="flex gap-m2 mb-m4">
      <Button onClick={() => onInsert('**bold**')}>Bold</Button>
      <Button onClick={() => onInsert('*italic*')}>Italic</Button>
      <Button onClick={() => onInsert('[link](url)')}>Link</Button>
    </div>
  )
}
```

---

## Где используется

### Текущие места использования

1. **Описание хакатона**
   - Форма: `src/features/hackathon-create/ui/HackathonCreateForm.tsx`
   - Просмотр: `src/features/hackathon-detail/ui/HackathonDetailInfo.tsx`

### Планируемые места использования

- Анонсы хакатонов
- Описание команд
- Описание проектов
- Комментарии (если будут добавлены)

---

## Связанная документация

- [Архитектура FSD-lite](../architecture/README.md)
- [UI компоненты](../README.md)
- [Дизайн-токены](../theming/README.md)
- [i18n](../i18n/README.md)
