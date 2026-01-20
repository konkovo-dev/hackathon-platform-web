'use client'

import { useTheme } from '@/shared/lib/theme'
import { Button } from './Button'

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <Button variant="secondary" size="sm" disabled>
        ...
      </Button>
    )
  }

  return (
    <Button variant="secondary" size="sm" onClick={toggleTheme} aria-label="Переключить тему">
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  )
}
