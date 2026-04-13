import type { components } from '@/shared/api/platform.schema'

export type SupportMessage = components['schemas']['v1Message']
export type SupportTicket = components['schemas']['v1Ticket']

export function sortMessagesByTime(messages: SupportMessage[]): SupportMessage[] {
  return [...messages].sort((a, b) => {
    const ta = a.createdAt ? Date.parse(a.createdAt) : 0
    const tb = b.createdAt ? Date.parse(b.createdAt) : 0
    return ta - tb
  })
}

/** userId автора, если сообщение от участника (или роль не задана) — для подгрузки имени/аватара. */
export function supportParticipantAuthorUserId(m: SupportMessage): string | null {
  if (m.authorRole === 'AUTHOR_ROLE_SYSTEM') return null
  if (!m.authorUserId) return null
  if (m.authorRole === 'AUTHOR_ROLE_MENTOR' || m.authorRole === 'AUTHOR_ROLE_ORGANIZER') {
    return null
  }
  return m.authorUserId
}

export function collectParticipantAuthorUserIds(messages: SupportMessage[]): string[] {
  const set = new Set<string>()
  for (const m of messages) {
    const id = supportParticipantAuthorUserId(m)
    if (id) set.add(id)
  }
  return [...set]
}

/** Ключ календарного дня в локальной таймзоне (YYYY-MM-DD) для группировки в чате. */
export function supportMessageLocalDayKey(iso: string | undefined): string | null {
  if (!iso) return null
  const ms = Date.parse(iso)
  if (Number.isNaN(ms)) return null
  const d = new Date(ms)
  const y = d.getFullYear()
  const m = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${day}`
}

export type SupportChatTimelineItem =
  | { kind: 'daySeparator'; anchorIso: string }
  | { kind: 'message'; message: SupportMessage }

/** Вставляет разделители календарных дней между сообщениями (порядок — как в списке). */
export function buildSupportChatTimeline(
  sortedMessages: SupportMessage[]
): SupportChatTimelineItem[] {
  const out: SupportChatTimelineItem[] = []
  let lastDayKey: string | null = null
  for (const message of sortedMessages) {
    const dayKey = supportMessageLocalDayKey(message.createdAt)
    if (dayKey != null && dayKey !== lastDayKey && message.createdAt) {
      out.push({ kind: 'daySeparator', anchorIso: message.createdAt })
      lastDayKey = dayKey
    } else if (dayKey != null) {
      lastDayKey = dayKey
    }
    out.push({ kind: 'message', message })
  }
  return out
}

export function sortTicketsByCreatedDesc(tickets: SupportTicket[]): SupportTicket[] {
  return [...tickets].sort((a, b) => {
    const ta = a.createdAt ? Date.parse(a.createdAt) : 0
    const tb = b.createdAt ? Date.parse(b.createdAt) : 0
    return tb - ta
  })
}

export function partitionOpenTickets(
  tickets: SupportTicket[],
  currentUserId: string | undefined,
  showOthersSection: boolean
): { unassigned: SupportTicket[]; mine: SupportTicket[]; others: SupportTicket[] } {
  const unassigned: SupportTicket[] = []
  const mine: SupportTicket[] = []
  const others: SupportTicket[] = []
  for (const t of tickets) {
    const mentorId = t.assignedMentorUserId
    if (!mentorId) {
      unassigned.push(t)
    } else if (currentUserId && mentorId === currentUserId) {
      mine.push(t)
    } else if (showOthersSection) {
      others.push(t)
    }
  }
  return { unassigned, mine, others }
}
