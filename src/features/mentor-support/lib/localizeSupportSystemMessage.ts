import type { I18nKey } from '@/shared/i18n/generated'
import type { MessageParams } from '@/shared/i18n/types'

const API_TEXT_TO_KEY = {
  'Mentor joined the chat': 'hackathons.support.system.mentor_joined',
  'Ticket closed': 'hackathons.support.system.ticket_closed',
} as const satisfies Record<string, I18nKey>

export type SupportTranslate = (key: I18nKey, params?: MessageParams) => string

export function localizeSupportSystemMessage(raw: string, t: SupportTranslate): string {
  const key = API_TEXT_TO_KEY[raw as keyof typeof API_TEXT_TO_KEY]
  if (key) return t(key)
  return raw
}
