'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { batchGetUsers } from '@/entities/user/api/batchGetUsers'
import { pickAvatarUrlFromPayload } from '@/entities/user/api/normalizeUserAvatar'
import { toAvatarImgSrc } from '@/shared/lib/avatarUrl'
import { randomUUID } from '@/shared/lib/randomUuid'
import { ApiError } from '@/shared/api/errors'
import type { SupportMessageAuthorProfile } from '../lib/supportMessageAuthorProfile'
import {
  claimSupportTicket,
  closeSupportTicket,
  getMySupportChatMessages,
  getSupportTicketMessages,
  listAllSupportTickets,
  listAssignedSupportTickets,
  replyInSupportTicket,
  sendSupportMessage,
} from '../api'
import { SUPPORT_POLL_MS, supportQueryKeys } from './supportQueryKeys'
import { useSupportRealtimeConnected } from './SupportRealtimeProvider'

export { supportQueryKeys, SUPPORT_POLL_MS } from './supportQueryKeys'

function newIdempotencyBody() {
  return { idempotencyKey: { key: randomUUID() } }
}

export function useSupportMentorAccessQuery(
  hackathonId: string | null | undefined,
  options: { enabled: boolean }
) {
  return useQuery({
    queryKey: hackathonId
      ? supportQueryKeys.mentorProbe(hackathonId)
      : ['support', 'mentor-probe', 'none'],
    queryFn: async () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      try {
        await listAssignedSupportTickets(hackathonId, {})
        return true
      } catch (e) {
        if (e instanceof ApiError && (e.data.status === 403 || e.data.status === 401)) {
          return false
        }
        throw e
      }
    },
    enabled: Boolean(hackathonId) && options.enabled,
    staleTime: 60_000,
    retry: false,
  })
}

export type { SupportMessageAuthorProfile } from '../lib/supportMessageAuthorProfile'

export function useSupportMessageAuthorsQuery(userIds: string[]) {
  const sortedKey = useMemo(
    () => [...new Set(userIds)].filter(Boolean).sort().join('\0'),
    [userIds]
  )

  return useQuery({
    queryKey: ['support', 'message-authors', sortedKey] as const,
    queryFn: async () => {
      const ids = sortedKey.length > 0 ? sortedKey.split('\0') : []
      const map = new Map<string, SupportMessageAuthorProfile>()
      if (ids.length === 0) return map

      const res = await batchGetUsers({ userIds: ids })
      for (const item of res.users ?? []) {
        const u = item.user
        if (!u?.userId) continue
        const displayName =
          [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.username?.trim() || ''
        const raw = pickAvatarUrlFromPayload(u)
        const avatarSrc = raw ? toAvatarImgSrc(raw) : null
        map.set(u.userId, { displayName, avatarSrc })
      }
      return map
    },
    enabled: sortedKey.length > 0,
    staleTime: 60_000,
  })
}

export function useMySupportMessagesQuery(hackathonId: string | null | undefined) {
  const realtimeConnected = useSupportRealtimeConnected()
  return useQuery({
    queryKey: hackathonId
      ? supportQueryKeys.myMessages(hackathonId)
      : ['support', 'my-messages', 'none'],
    queryFn: async () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      const res = await getMySupportChatMessages(hackathonId)
      return res.messages ?? []
    },
    enabled: Boolean(hackathonId),
    staleTime: 10_000,
    refetchInterval: realtimeConnected ? false : SUPPORT_POLL_MS,
  })
}

export function useSupportOpenTicketsQuery(
  hackathonId: string | null | undefined,
  enabled: boolean
) {
  const realtimeConnected = useSupportRealtimeConnected()
  return useQuery({
    queryKey: hackathonId
      ? supportQueryKeys.allOpenTickets(hackathonId)
      : ['support', 'tickets', 'all-open', 'none'],
    queryFn: async () => {
      if (!hackathonId) throw new Error('hackathonId is required')
      const res = await listAllSupportTickets(hackathonId, {
        statusFilter: { statuses: ['TICKET_STATUS_OPEN'] },
      })
      return res.tickets ?? []
    },
    enabled: Boolean(hackathonId) && enabled,
    staleTime: 10_000,
    refetchInterval: realtimeConnected ? false : SUPPORT_POLL_MS,
  })
}

export function useSupportTicketMessagesQuery(
  hackathonId: string | null | undefined,
  ticketId: string | null | undefined,
  enabled: boolean
) {
  const realtimeConnected = useSupportRealtimeConnected()
  return useQuery({
    queryKey:
      hackathonId && ticketId
        ? supportQueryKeys.ticketMessages(hackathonId, ticketId)
        : ['support', 'ticket-messages', 'none'],
    queryFn: async () => {
      if (!hackathonId || !ticketId) throw new Error('hackathonId and ticketId are required')
      const res = await getSupportTicketMessages(hackathonId, ticketId)
      return res.messages ?? []
    },
    enabled: Boolean(hackathonId && ticketId) && enabled,
    staleTime: 10_000,
    refetchInterval: realtimeConnected ? false : SUPPORT_POLL_MS,
  })
}

export function useSendSupportMessageMutation(hackathonId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (text: string) =>
      sendSupportMessage(hackathonId, {
        text,
        ...newIdempotencyBody(),
        clientMessageId: randomUUID(),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportQueryKeys.myMessages(hackathonId) })
    },
  })
}

export function useClaimSupportTicketMutation(hackathonId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ticketId: string) =>
      claimSupportTicket(hackathonId, ticketId, newIdempotencyBody()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportQueryKeys.allOpenTickets(hackathonId) })
    },
  })
}

export function useReplySupportTicketMutation(hackathonId: string, ticketId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (text: string) =>
      replyInSupportTicket(hackathonId, ticketId, { text, ...newIdempotencyBody() }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportQueryKeys.ticketMessages(hackathonId, ticketId) })
    },
  })
}

export function useCloseSupportTicketMutation(hackathonId: string, ticketId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => closeSupportTicket(hackathonId, ticketId, newIdempotencyBody()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportQueryKeys.ticketMessages(hackathonId, ticketId) })
      qc.invalidateQueries({ queryKey: supportQueryKeys.allOpenTickets(hackathonId) })
    },
  })
}
