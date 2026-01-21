import { DEFAULT_LOCALE, type Locale } from './config'
import { flattenMessages } from './flatten'
import type { I18nKey } from './generated'
import type { FlatMessages, MessageParams, MessagesTree, PluralMessage } from './types'

const interpolate = (template: string, params?: MessageParams) => {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_m, name: string) => {
    const v = params[name]
    return v === null || v === undefined ? '' : String(v)
  })
}

const isPluralMessage = (v: unknown): v is PluralMessage =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && typeof (v as any).other === 'string'

export type Translator = {
  locale: Locale
  t: (key: I18nKey, params?: MessageParams) => string
}

export const createTranslator = (messages: MessagesTree, locale: Locale = DEFAULT_LOCALE): Translator => {
  const flat: FlatMessages = flattenMessages(messages)
  const pluralRules = new Intl.PluralRules(locale)

  const t = (key: I18nKey, params?: MessageParams) => {
    const v = flat[key]
    if (!v) {
      // в проде лучше возвращать key, чтобы UI не падал
      return key
    }

    if (typeof v === 'string') {
      return interpolate(v, params)
    }

    if (isPluralMessage(v)) {
      const countRaw = params?.count
      const count = typeof countRaw === 'number' ? countRaw : Number(countRaw)
      const category = Number.isFinite(count) ? pluralRules.select(count) : 'other'
      const msg = (v as any)[category] ?? v.other
      return interpolate(msg, params)
    }

    return key
  }

  return { locale, t }
}
