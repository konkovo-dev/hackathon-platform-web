import { describe, expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { invalidateSupportQueriesFromPublication } from './invalidateSupportQueriesFromPublication'
import { supportQueryKeys } from '../model/supportQueryKeys'

describe('invalidateSupportQueriesFromPublication', () => {
  it('игнорирует payload с другим hackathon_id', () => {
    const qc = new QueryClient()
    const spy = vi.spyOn(qc, 'invalidateQueries')
    invalidateSupportQueriesFromPublication(
      { type: 'message.created', hackathon_id: 'other', ticket_id: 't1' },
      'h1',
      qc
    )
    expect(spy).not.toHaveBeenCalled()
  })

  it('по message.created инвалидирует my-messages, all-open и ticket-messages', () => {
    const qc = new QueryClient()
    const spy = vi.spyOn(qc, 'invalidateQueries')
    invalidateSupportQueriesFromPublication(
      { type: 'message.created', hackathon_id: 'h1', ticket_id: 't1' },
      'h1',
      qc
    )
    expect(spy).toHaveBeenCalledWith({ queryKey: supportQueryKeys.myMessages('h1') })
    expect(spy).toHaveBeenCalledWith({ queryKey: supportQueryKeys.allOpenTickets('h1') })
    expect(spy).toHaveBeenCalledWith({ queryKey: supportQueryKeys.ticketMessages('h1', 't1') })
  })

  it('по ticket.closed инвалидирует списки и сообщения тикета', () => {
    const qc = new QueryClient()
    const spy = vi.spyOn(qc, 'invalidateQueries')
    invalidateSupportQueriesFromPublication(
      { type: 'ticket.closed', hackathon_id: 'h1', ticket_id: 't1' },
      'h1',
      qc
    )
    expect(spy).toHaveBeenCalledWith({ queryKey: supportQueryKeys.allOpenTickets('h1') })
    expect(spy).toHaveBeenCalledWith({ queryKey: supportQueryKeys.ticketMessages('h1', 't1') })
  })
})
