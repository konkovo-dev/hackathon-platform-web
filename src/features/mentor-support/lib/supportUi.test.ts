import { describe, expect, it } from 'vitest'
import {
  buildSupportChatTimeline,
  collectParticipantAuthorUserIds,
  partitionOpenTickets,
  sortMessagesByTime,
  sortTicketsByCreatedDesc,
  supportParticipantAuthorUserId,
} from './supportUi'
import type { SupportMessage, SupportTicket } from './supportUi'

describe('supportParticipantAuthorUserId', () => {
  it('возвращает userId для участника и unspecified', () => {
    expect(
      supportParticipantAuthorUserId({
        authorUserId: 'u1',
        authorRole: 'AUTHOR_ROLE_PARTICIPANT',
      })
    ).toBe('u1')
    expect(
      supportParticipantAuthorUserId({
        authorUserId: 'u2',
        authorRole: 'AUTHOR_ROLE_UNSPECIFIED',
      })
    ).toBe('u2')
  })

  it('не возвращает id для ментора, организатора и системы', () => {
    expect(
      supportParticipantAuthorUserId({
        authorUserId: 'm1',
        authorRole: 'AUTHOR_ROLE_MENTOR',
      })
    ).toBeNull()
    expect(
      supportParticipantAuthorUserId({
        authorUserId: 'o1',
        authorRole: 'AUTHOR_ROLE_ORGANIZER',
      })
    ).toBeNull()
    expect(
      supportParticipantAuthorUserId({
        authorUserId: 's1',
        authorRole: 'AUTHOR_ROLE_SYSTEM',
      })
    ).toBeNull()
  })
})

describe('collectParticipantAuthorUserIds', () => {
  it('собирает уникальные id участников', () => {
    const ids = collectParticipantAuthorUserIds([
      { authorUserId: 'a', authorRole: 'AUTHOR_ROLE_PARTICIPANT' },
      { authorUserId: 'a', authorRole: 'AUTHOR_ROLE_PARTICIPANT' },
      { authorUserId: 'b', authorRole: 'AUTHOR_ROLE_PARTICIPANT' },
      { authorUserId: 'm', authorRole: 'AUTHOR_ROLE_MENTOR' },
    ])
    expect(ids.sort()).toEqual(['a', 'b'])
  })
})

describe('sortMessagesByTime', () => {
  it('orders by createdAt ascending', () => {
    const messages: SupportMessage[] = [
      { messageId: '2', text: 'b', createdAt: '2026-01-02T00:00:00Z' },
      { messageId: '1', text: 'a', createdAt: '2026-01-01T00:00:00Z' },
    ]
    const sorted = sortMessagesByTime(messages)
    expect(sorted.map(m => m.messageId)).toEqual(['1', '2'])
  })
})

describe('buildSupportChatTimeline', () => {
  it('вставляет один разделитель на первое сообщение дня', () => {
    const messages: SupportMessage[] = [
      { messageId: 'a', text: 'a', createdAt: '2026-01-01T10:00:00Z' },
      { messageId: 'b', text: 'b', createdAt: '2026-01-01T18:00:00Z' },
    ]
    const sorted = sortMessagesByTime(messages)
    const timeline = buildSupportChatTimeline(sorted)
    expect(timeline.map(x => x.kind)).toEqual(['daySeparator', 'message', 'message'])
  })

  it('вставляет разделитель при смене календарного дня', () => {
    const messages: SupportMessage[] = [
      { messageId: 'a', text: 'a', createdAt: '2026-01-01T10:00:00Z' },
      { messageId: 'b', text: 'b', createdAt: '2026-01-02T10:00:00Z' },
    ]
    const sorted = sortMessagesByTime(messages)
    const timeline = buildSupportChatTimeline(sorted)
    expect(timeline.map(x => x.kind)).toEqual([
      'daySeparator',
      'message',
      'daySeparator',
      'message',
    ])
  })
})

describe('sortTicketsByCreatedDesc', () => {
  it('orders by createdAt descending', () => {
    const tickets: SupportTicket[] = [
      { ticketId: 'a', createdAt: '2026-01-01T00:00:00Z' },
      { ticketId: 'b', createdAt: '2026-01-03T00:00:00Z' },
    ]
    const sorted = sortTicketsByCreatedDesc(tickets)
    expect(sorted.map(t => t.ticketId)).toEqual(['b', 'a'])
  })
})

describe('partitionOpenTickets', () => {
  it('splits unassigned, mine, and others for organizer', () => {
    const tickets: SupportTicket[] = [
      { ticketId: 'u', assignedMentorUserId: undefined },
      { ticketId: 'm', assignedMentorUserId: 'me' },
      { ticketId: 'o', assignedMentorUserId: 'other' },
    ]
    const { unassigned, mine, others } = partitionOpenTickets(tickets, 'me', true)
    expect(unassigned.map(t => t.ticketId)).toEqual(['u'])
    expect(mine.map(t => t.ticketId)).toEqual(['m'])
    expect(others.map(t => t.ticketId)).toEqual(['o'])
  })

  it('hides others section when not organizer view', () => {
    const tickets: SupportTicket[] = [{ ticketId: 'o', assignedMentorUserId: 'other' }]
    const { others } = partitionOpenTickets(tickets, 'me', false)
    expect(others).toHaveLength(0)
  })
})
