'use client'

import { useTheme } from '@/shared/lib/theme'
import { Button } from './Button'

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" disabled>
        ...
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Переключить тему">
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  )
}
