'use client'

import { useI18n } from './useT'

/**
 * Хук для получения текущей локали
 */
export function useLocale() {
  const { locale } = useI18n()
  return locale
}
