'use client'

import { Button } from './Button'
import { useI18n } from '@/shared/i18n/useT'
import type { Locale } from '@/shared/i18n/config'

export function LocaleToggle() {
  const { locale, setLocale } = useI18n()

  const set = (nextLocale: Locale) => () => setLocale(nextLocale)

  return (
    <div className="inline-flex rounded-md border border-border-default overflow-hidden">
      <Button
        variant={locale === 'ru' ? 'primary' : 'secondary'}
        size="sm"
        onClick={set('ru')}
        aria-label="Переключить язык на русский"
        className="rounded-none"
        text="ru"
        type="button"
      />
      <Button
        variant={locale === 'en' ? 'primary' : 'secondary'}
        size="sm"
        onClick={set('en')}
        aria-label="Switch language to English"
        className="rounded-none"
        text="en"
        type="button"
      />
    </div>
  )
}
