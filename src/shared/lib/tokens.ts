/**
 * Утилиты для работы с токенами дизайна
 */

import { getColor } from '../config/tokens'

/**
 * Получить CSS переменную для цвета
 * Используется когда нужно получить значение цвета в JS/TS коде
 */
export function getColorVar(tokenPath: string): string {
  // Преобразуем путь токена в имя CSS переменной
  // Например: 'brand.primary' -> '--color-brand-primary'
  const varName = `--color-${tokenPath.replace(/\./g, '-')}`
  return `var(${varName})`
}

/**
 * Получить значение цвета напрямую (hex)
 * Используется для canvas, SVG, инлайн-стилей и т.д.
 */
export function getColorValue(tokenPath: string): string {
  return getColor(tokenPath)
}
