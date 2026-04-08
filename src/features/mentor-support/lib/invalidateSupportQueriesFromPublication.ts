import type { QueryClient } from '@tanstack/react-query'
import { supportQueryKeys } from '../model/supportQueryKeys'

/**
 * Данные публикации Centrifugo из бэкенда (`support:feed#<user_id>`).
 * См. hackaton-platform-api internal/mentors-service/usecase/outbox/handlers.go
 */
export function invalidateSupportQueriesFromPublication(
  data: unknown,
  hackathonId: string,
  qc: QueryClient
): void {
  if (data == null || typeof data !== 'object') return
  const d = data as Record<string, unknown>
  if (d.hackathon_id !== hackathonId) return

  const type = d.type
  if (type === 'message.created') {
    void qc.invalidateQueries({ queryKey: supportQueryKeys.myMessages(hackathonId) })
    void qc.invalidateQueries({ queryKey: supportQueryKeys.allOpenTickets(hackathonId) })
    const tid = d.ticket_id
    if (typeof tid === 'string' && tid.length > 0) {
      void qc.invalidateQueries({ queryKey: supportQueryKeys.ticketMessages(hackathonId, tid) })
    }
    return
  }

  if (type === 'ticket.closed' || type === 'ticket.assigned') {
    void qc.invalidateQueries({ queryKey: supportQueryKeys.allOpenTickets(hackathonId) })
    const tid = d.ticket_id
    if (typeof tid === 'string' && tid.length > 0) {
      void qc.invalidateQueries({ queryKey: supportQueryKeys.ticketMessages(hackathonId, tid) })
    }
  }
}
