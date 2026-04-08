import type { SupportTranslate } from './localizeSupportSystemMessage'

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/**
 * Подпись разделителя дня в чате поддержки: сегодня / вчера / дата по локали.
 */
export function formatSupportChatDayLabel(
  anchorIso: string,
  locale: string,
  t: SupportTranslate,
  now: Date = new Date()
): string {
  const d = new Date(anchorIso)
  if (Number.isNaN(d.getTime())) return ''

  const anchorDay = startOfLocalDay(d)
  const today = startOfLocalDay(now)
  const diffDays = Math.round((today.getTime() - anchorDay.getTime()) / 86_400_000)

  if (diffDays === 0) return t('hackathons.support.date.today')
  if (diffDays === 1) return t('hackathons.support.date.yesterday')

  const currentYear = now.getFullYear()
  const opts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
  }
  if (d.getFullYear() !== currentYear) opts.year = 'numeric'
  return d.toLocaleDateString(locale, opts)
}
