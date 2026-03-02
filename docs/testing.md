# Testing Guide

Краткое руководство по тестированию.

## Стек

- **Vitest** — test runner (быстрее Jest, нативный ESM)
- **@testing-library/react** + **user-event** — тестирование компонентов
- **MSW** — моки API
- **Playwright** — E2E тесты

## Команды

```bash
pnpm test              # запустить все тесты
pnpm test:watch        # watch mode
pnpm test:coverage     # coverage report
pnpm test:e2e          # E2E тесты
```

## Архитектура

**Colocation:** тесты рядом с кодом (`Button.tsx` → `Button.test.tsx`)

**Централизованная папка `tests/`:**
- `setup/` — MSW, test-utils, моки
- `fixtures/` — mockUser, mockSkills
- `e2e/` — Playwright тесты

## Setup (tests/setup/)

### vitest.setup.ts

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { server } from './msw'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => { cleanup(); server.resetHandlers() })
afterAll(() => server.close())

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))
```

### msw.ts

```typescript
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { mockUser } from '../fixtures/mockUser'

export const handlers = [
  http.get('/api/platform/v1/users/me', () => HttpResponse.json(mockUser)),
  http.put('/api/platform/v1/users/me', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...mockUser, ...body })
  }),
]

export const server = setupServer(...handlers)
```

### test-utils.tsx

```typescript
import { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function AllTheProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export function renderWithProviders(ui: ReactElement, options?) {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

export * from '@testing-library/react'
```

## Unit-тесты

```typescript
import { describe, it, expect } from 'vitest'
import { getSkillName } from './types'

describe('getSkillName', () => {
  it('should return catalog name if present', () => {
    expect(getSkillName({ catalogName: 'React', customName: null })).toBe('React')
  })
  
  it('should fallback to custom name', () => {
    expect(getSkillName({ catalogName: null, customName: 'ReactJS' })).toBe('ReactJS')
  })
})
```

## Integration-тесты

### Принципы

1. Тестируй как пользователь — `getByRole`, `getByLabelText`, не `data-testid`
2. Используй `userEvent` вместо `fireEvent`
3. Используй `waitFor` для async операций

### Пример

```typescript
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@tests/setup/test-utils'
import { Button } from './Button'

describe('Button', () => {
  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    renderWithProviders(<Button onClick={handleClick}>Click</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('should be disabled', () => {
    renderWithProviders(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

## E2E-тесты (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test.describe('Profile page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/profile')
  })
  
  test('should edit name', async ({ page }) => {
    await page.click('button:has-text("Edit")')
    await page.fill('input[name="firstName"]', 'Пётр')
    await page.click('button:has-text("Save")')
    
    await expect(page.locator('text=Пётр')).toBeVisible()
  })
})
```

## Best Practices

1. **AAA Pattern:** Arrange → Act → Assert
2. **Не тестируй implementation details** — тестируй видимое поведение
3. **Используй fixtures** — переиспользуй моки из `tests/fixtures/`
4. **Изолируй тесты** — каждый тест независим
5. **Тестируй edge cases** — null, undefined, пустые строки
6. **Мокай минимум** — только то, что действительно нужно

## Troubleshooting

| Проблема | Решение |
|---|---|
| "Cannot find module" | Добавь алиас в `vitest.config.ts`: `alias: { '@': path.resolve('./src') }` |
| "Window is not defined" | Используй `environment: 'happy-dom'` |
| MSW не работает | Проверь `beforeAll(() => server.listen())` в setup |
| Тест висит | Используй `waitFor` с timeout |
| "Unable to find role" | Используй `getByText` или добавь `role` в элемент |
