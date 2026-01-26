'use client'

import { createContext } from 'react'
import type { Locale } from './config'
import type { I18nKey } from './generated'
import type { MessagesTree, MessageParams } from './types'

export type I18nContextValue = {
  locale: Locale
  messages: MessagesTree
  t: (key: I18nKey, params?: MessageParams) => string
  setLocale: (locale: Locale) => void
}

export const I18nContext = createContext<I18nContextValue | null>(null)
