import { describe, expect, it } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { applyPublicationToCache } from './applyPublicationToCache'
import { supportQueryKeys } from '../model/supportQueryKeys'

const H = 'h1'
const T = 't1'

function makeQc() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

describe('applyPublicationToCache', () => {
  it('игнорирует payload с другим hackathon_id', () => {
    const qc = makeQc()
    qc.setQueryData(supportQueryKeys.myMessages(H), [])
    applyPublicationToCache(
      { type: 'message.created', hackathon_id: 'other', ticket_id: T, message_id: 'm1', text: 'hi' },
      H,
      qc
    )
    expect(qc.getQueryData(supportQueryKeys.myMessages(H))).toEqual([])
  })

  it('message.created: добавляет сообщение в myMessages и ticketMessages', () => {
    const qc = makeQc()
    qc.setQueryData(supportQueryKeys.myMessages(H), [])
    qc.setQueryData(supportQueryKeys.ticketMessages(H, T), [])

    // Бэкенд шлёт доменные строки ("mentor", "system"), а не proto-имена
    applyPublicationToCache(
      { type: 'message.created', hackathon_id: H, ticket_id: T, message_id: 'm1', author_user_id: 'u1', author_role: 'mentor', text: 'hello' },
      H,
      qc
    )

    const myMessages = qc.getQueryData<unknown[]>(supportQueryKeys.myMessages(H))
    const ticketMessages = qc.getQueryData<unknown[]>(supportQueryKeys.ticketMessages(H, T))
    expect(myMessages).toHaveLength(1)
    expect(ticketMessages).toHaveLength(1)
    expect((myMessages![0] as Record<string, unknown>).messageId).toBe('m1')
    expect((myMessages![0] as Record<string, unknown>).text).toBe('hello')
    expect((myMessages![0] as Record<string, unknown>).authorRole).toBe('AUTHOR_ROLE_MENTOR')
  })

  it('message.created: не дублирует уже существующее сообщение', () => {
    const qc = makeQc()
    const existing = { messageId: 'm1', text: 'hello' }
    qc.setQueryData(supportQueryKeys.myMessages(H), [existing])

    applyPublicationToCache(
      { type: 'message.created', hackathon_id: H, ticket_id: T, message_id: 'm1', text: 'hello' },
      H,
      qc
    )

    expect(qc.getQueryData<unknown[]>(supportQueryKeys.myMessages(H))).toHaveLength(1)
  })

  it('message.created: не трогает кэш если он не загружен', () => {
    const qc = makeQc()
    applyPublicationToCache(
      { type: 'message.created', hackathon_id: H, ticket_id: T, message_id: 'm1', text: 'hi' },
      H,
      qc
    )
    expect(qc.getQueryData(supportQueryKeys.myMessages(H))).toBeUndefined()
  })

  it('ticket.assigned: обновляет assignedMentorUserId в нужном тикете', () => {
    const qc = makeQc()
    qc.setQueryData(supportQueryKeys.allOpenTickets(H), [
      { ticketId: T, assignedMentorUserId: undefined },
      { ticketId: 't2', assignedMentorUserId: undefined },
    ])

    applyPublicationToCache(
      { type: 'ticket.assigned', hackathon_id: H, ticket_id: T, assigned_mentor_user_id: 'mentor1' },
      H,
      qc
    )

    const tickets = qc.getQueryData<Array<Record<string, unknown>>>(supportQueryKeys.allOpenTickets(H))
    expect(tickets!.find(t => t.ticketId === T)?.assignedMentorUserId).toBe('mentor1')
    expect(tickets!.find(t => t.ticketId === 't2')?.assignedMentorUserId).toBeUndefined()
  })

  it('ticket.closed: убирает тикет из allOpenTickets', () => {
    const qc = makeQc()
    qc.setQueryData(supportQueryKeys.allOpenTickets(H), [
      { ticketId: T },
      { ticketId: 't2' },
    ])

    applyPublicationToCache(
      { type: 'ticket.closed', hackathon_id: H, ticket_id: T },
      H,
      qc
    )

    const tickets = qc.getQueryData<Array<Record<string, unknown>>>(supportQueryKeys.allOpenTickets(H))
    expect(tickets).toHaveLength(1)
    expect(tickets![0].ticketId).toBe('t2')
  })
})
