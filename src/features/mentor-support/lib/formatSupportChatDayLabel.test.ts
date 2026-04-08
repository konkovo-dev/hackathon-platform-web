import { describe, expect, it } from 'vitest'
import type { SupportTranslate } from './localizeSupportSystemMessage'
import { formatSupportChatDayLabel } from './formatSupportChatDayLabel'

const mockT = ((key: string) => {
  if (key === 'hackathons.support.date.today') return 'сегодня'
  if (key === 'hackathons.support.date.yesterday') return 'вчера'
  return key
}) as SupportTranslate

describe('formatSupportChatDayLabel', () => {
  it('возвращает подпись «сегодня» для того же локального дня', () => {
    const now = new Date(2026, 3, 15, 18, 0, 0)
    const anchor = new Date(2026, 3, 15, 9, 0, 0).toISOString()
    expect(formatSupportChatDayLabel(anchor, 'ru', mockT, now)).toBe('сегодня')
  })

  it('возвращает подпись «вчера» для предыдущего локального дня', () => {
    const now = new Date(2026, 3, 15, 12, 0, 0)
    const anchor = new Date(2026, 3, 14, 12, 0, 0).toISOString()
    expect(formatSupportChatDayLabel(anchor, 'ru', mockT, now)).toBe('вчера')
  })

  it('возвращает пустую строку для невалидной даты', () => {
    expect(formatSupportChatDayLabel('invalid', 'ru', mockT)).toBe('')
  })
})
