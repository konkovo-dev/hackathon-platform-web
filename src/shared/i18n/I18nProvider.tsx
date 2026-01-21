'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { I18nContext } from './context'
import { I18N_COOKIE_NAME, type Locale } from './config'
import { createTranslator } from './create_translator'
import type { MessagesTree } from './types'

export type I18nProviderProps = {
  locale: Locale
  messages: MessagesTree
  children: React.ReactNode
}

export const I18nProvider = ({ locale, messages, children }: I18nProviderProps) => {
  const router = useRouter()

  const { t } = useMemo(() => createTranslator(messages, locale), [messages, locale])

  const setLocale = (nextLocale: Locale) => {
    document.cookie = `${I18N_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000`
    router.refresh()
    setTimeout(() => {
      if (document.documentElement.lang !== nextLocale) {
        window.location.reload()
      }
    }, 0)
  }

  return (
    <I18nContext.Provider value={{ locale, messages, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}
