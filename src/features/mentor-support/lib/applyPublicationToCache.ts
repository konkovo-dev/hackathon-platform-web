import type { QueryClient } from '@tanstack/react-query'
import type {
  SupportGetMyChatMessagesResponse,
  SupportListAllTicketsResponse,
} from '../api'
import { supportQueryKeys } from '../model/supportQueryKeys'

type SupportMessage = NonNullable<SupportGetMyChatMessagesResponse['messages']>[number]
type SupportTicket = NonNullable<SupportListAllTicketsResponse['tickets']>[number]

/**
 * Данные публикации Centrifugo из бэкенда (`support:feed#<user_id>`).
 * См. hackaton-platform-api internal/mentors-service/usecase/outbox/handlers.go
 */
export function applyPublicationToCache(
  data: unknown,
  hackathonId: string,
  qc: QueryClient
): void {
  if (data == null || typeof data !== 'object') return
  const d = data as Record<string, unknown>
  if (d.hackathon_id !== hackathonId) return

  const type = d.type

  if (type === 'message.created') {
    const ticketId = typeof d.ticket_id === 'string' ? d.ticket_id : undefined
    const messageId = typeof d.message_id === 'string' ? d.message_id : undefined
    const message: SupportMessage = {
      messageId,
      ticketId,
      authorUserId: typeof d.author_user_id === 'string' ? d.author_user_id : undefined,
      authorRole: typeof d.author_role === 'string' ? mapAuthorRole(d.author_role) : undefined,
      text: typeof d.text === 'string' ? d.text : undefined,
      createdAt: new Date().toISOString(),
    }

    qc.setQueryData<SupportMessage[]>(
      supportQueryKeys.myMessages(hackathonId),
      old => appendIfAbsent(old, message, messageId),
    )

    if (ticketId) {
      qc.setQueryData<SupportMessage[]>(
        supportQueryKeys.ticketMessages(hackathonId, ticketId),
        old => appendIfAbsent(old, message, messageId),
      )
    }
    return
  }

  if (type === 'ticket.assigned') {
    const ticketId = typeof d.ticket_id === 'string' ? d.ticket_id : undefined
    const assignedMentorUserId =
      typeof d.assigned_mentor_user_id === 'string' && d.assigned_mentor_user_id
        ? d.assigned_mentor_user_id
        : undefined

    if (ticketId) {
      qc.setQueryData<SupportTicket[]>(
        supportQueryKeys.allOpenTickets(hackathonId),
        old => old?.map(t => t.ticketId === ticketId ? { ...t, assignedMentorUserId } : t),
      )
    }
    return
  }

  if (type === 'ticket.closed') {
    const ticketId = typeof d.ticket_id === 'string' ? d.ticket_id : undefined

    if (ticketId) {
      qc.setQueryData<SupportTicket[]>(
        supportQueryKeys.allOpenTickets(hackathonId),
        old => old?.filter(t => t.ticketId !== ticketId),
      )
    }
  }
}

// Бэкенд хранит роли как доменные строки ("mentor", "system"),
// но HTTP API маппит их в proto-имена ("AUTHOR_ROLE_MENTOR", "AUTHOR_ROLE_SYSTEM").
// Centrifugo шлёт сырые доменные строки — нужен ручной маппинг.
function mapAuthorRole(raw: string): SupportMessage['authorRole'] {
  switch (raw) {
    case 'participant': return 'AUTHOR_ROLE_PARTICIPANT'
    case 'mentor':      return 'AUTHOR_ROLE_MENTOR'
    case 'organizer':   return 'AUTHOR_ROLE_ORGANIZER'
    case 'system':      return 'AUTHOR_ROLE_SYSTEM'
    default:            return 'AUTHOR_ROLE_UNSPECIFIED'
  }
}

function appendIfAbsent<T extends { messageId?: string }>(
  old: T[] | undefined,
  item: T,
  messageId: string | undefined,
): T[] | undefined {
  if (!old) return old
  if (messageId && old.some(m => m.messageId === messageId)) return old
  return [...old, item]
}
