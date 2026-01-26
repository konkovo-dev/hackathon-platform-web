import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, I18N_COOKIE_NAME, NAMESPACES, type Locale, type Namespace } from './config'
import { createTranslator } from './create_translator'
import { loadNamespaces } from './messages'
import type { MessagesTree } from './types'

export const getServerLocale = (): Locale => {
  const raw = cookies().get(I18N_COOKIE_NAME)?.value
  if (raw === 'ru' || raw === 'en') return raw
  return DEFAULT_LOCALE
}

export const getServerMessages = async (namespaces: readonly Namespace[] = NAMESPACES) => {
  const locale = getServerLocale()
  const messages = await loadNamespaces(locale, namespaces)
  return { locale, messages }
}

export const getServerI18n = async (namespaces: readonly Namespace[] = NAMESPACES) => {
  const { locale, messages } = await getServerMessages(namespaces)
  const { t } = createTranslator(messages, locale)
  return { locale, messages, t }
}

export const mergeMessages = (...parts: MessagesTree[]): MessagesTree => {
  return Object.assign({}, ...parts)
}
