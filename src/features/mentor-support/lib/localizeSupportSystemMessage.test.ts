import { describe, expect, it, vi } from 'vitest'
import { localizeSupportSystemMessage } from './localizeSupportSystemMessage'

describe('localizeSupportSystemMessage', () => {
  it('maps known API strings to i18n keys', () => {
    const t = vi.fn((key: string) => `t:${key}`)
    expect(localizeSupportSystemMessage('Ticket closed', t)).toBe(
      't:hackathons.support.system.ticket_closed'
    )
    expect(localizeSupportSystemMessage('Mentor joined the chat', t)).toBe(
      't:hackathons.support.system.mentor_joined'
    )
    expect(t).toHaveBeenCalledWith('hackathons.support.system.ticket_closed')
  })

  it('returns raw text for unknown system messages', () => {
    const t = vi.fn()
    expect(localizeSupportSystemMessage('Some new event', t)).toBe('Some new event')
    expect(t).not.toHaveBeenCalled()
  })
})
