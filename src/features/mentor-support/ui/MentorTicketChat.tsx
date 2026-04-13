'use client'

import { useMemo, useState } from 'react'
import { Button, Chip, Input } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useSessionQuery } from '@/features/auth/model/hooks'
import {
  useCloseSupportTicketMutation,
  useReplySupportTicketMutation,
  useSupportMessageAuthorsQuery,
  useSupportTicketMessagesQuery,
} from '../model/hooks'
import type { SupportTicket } from '../lib/supportUi'
import { useSupportViewerOutgoingMeta } from '../lib/useSupportViewerOutgoingMeta'
import {
  buildSupportChatTimeline,
  collectParticipantAuthorUserIds,
  sortMessagesByTime,
  supportParticipantAuthorUserId,
} from '../lib/supportUi'
import { SupportChatComposer, SupportChatThread } from './SupportChatShell'
import { SupportChatDaySeparator } from './SupportChatDaySeparator'
import { SupportMessageRow } from './SupportMessageRow'

const bubbleEnd = 'end' as const
const bubbleStart = 'start' as const

export interface MentorTicketChatProps {
  hackathonId: string
  ticket: SupportTicket
  /** Ложь для организатора: подсказка про claim не показывается. */
  canClaimTickets: boolean
}

export function MentorTicketChat({ hackathonId, ticket, canClaimTickets }: MentorTicketChatProps) {
  const t = useT()
  const { data: session } = useSessionQuery()
  const viewerUserId = session && session.active ? session.userId : undefined
  const ticketId = ticket.ticketId ?? ''
  const messagesQuery = useSupportTicketMessagesQuery(hackathonId, ticketId, Boolean(ticketId))
  const replyMutation = useReplySupportTicketMutation(hackathonId, ticketId)
  const closeMutation = useCloseSupportTicketMutation(hackathonId, ticketId)
  const outgoingViewer = useSupportViewerOutgoingMeta()
  const [draft, setDraft] = useState('')

  const sorted = useMemo(() => sortMessagesByTime(messagesQuery.data ?? []), [messagesQuery.data])

  const participantAuthorIds = useMemo(() => collectParticipantAuthorUserIds(sorted), [sorted])
  const authorsQuery = useSupportMessageAuthorsQuery(participantAuthorIds)

  const timeline = useMemo(() => buildSupportChatTimeline(sorted), [sorted])

  const isOpen = ticket.status === 'TICKET_STATUS_OPEN'
  const isTakenByMe =
    viewerUserId != null &&
    ticket.assignedMentorUserId != null &&
    ticket.assignedMentorUserId === viewerUserId
  const canActAsAssignee = isOpen && isTakenByMe

  const assignedToOther =
    isOpen &&
    !canActAsAssignee &&
    ticket.assignedMentorUserId != null &&
    ticket.assignedMentorUserId !== viewerUserId

  const showClaimHint =
    isOpen && !canActAsAssignee && !ticket.assignedMentorUserId && canClaimTickets

  const ownerKindLabel = (() => {
    if (ticket.ownerKind === 'OWNER_KIND_TEAM') return t('hackathons.support.mentor.owner_team')
    if (ticket.ownerKind === 'OWNER_KIND_USER') return t('hackathons.support.mentor.owner_user')
    return t('hackathons.support.mentor.owner_user')
  })()

  const handleReply = async () => {
    const text = draft.trim()
    if (!text || replyMutation.isPending) return
    setDraft('')
    try {
      await replyMutation.mutateAsync(text)
    } catch {
      setDraft(text)
    }
  }

  const ticketMutationError = replyMutation.error ?? closeMutation.error

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-m5">
      {ticketMutationError ? (
        <p className="typography-body-sm-regular text-state-error">
          {t('hackathons.support.error')}
        </p>
      ) : null}

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-m3 border-b border-border-default pb-m4">
        <span className="typography-body-sm-regular text-text-secondary">{ownerKindLabel}</span>
        <div className="flex flex-wrap items-center gap-m3">
          <Chip
            variant="secondary"
            label={
              isOpen
                ? t('hackathons.support.mentor.status_open')
                : t('hackathons.support.mentor.status_closed')
            }
          />
          {canActAsAssignee ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              text={t('hackathons.support.mentor.close_ticket')}
              disabled={closeMutation.isPending}
              onClick={() => void closeMutation.mutateAsync().catch(() => {})}
            />
          ) : null}
        </div>
      </div>

      {messagesQuery.isLoading ? (
        <p className="typography-body-md text-text-secondary">{t('hackathons.support.loading')}</p>
      ) : messagesQuery.isError ? (
        <p className="typography-body-md text-state-error">{t('hackathons.support.error')}</p>
      ) : (
        <SupportChatThread className="min-h-0 flex-1">
          {timeline.map((item, index) => {
            if (item.kind === 'daySeparator') {
              return (
                <SupportChatDaySeparator
                  key={`day-${item.anchorIso}-${index}`}
                  anchorIso={item.anchorIso}
                />
              )
            }
            const m = item.message
            const isOwn =
              m.authorUserId != null && viewerUserId != null && m.authorUserId === viewerUserId
            const side = isOwn ? bubbleEnd : bubbleStart
            const peerId = supportParticipantAuthorUserId(m)
            const incomingParticipantAuthor =
              side === bubbleStart && peerId ? (authorsQuery.data?.get(peerId) ?? null) : null
            return (
              <SupportMessageRow
                key={m.messageId ?? `${m.createdAt}-${m.text}-${index}`}
                text={m.text ?? ''}
                createdAt={m.createdAt}
                authorRole={m.authorRole}
                bubbleSide={side}
                outgoingViewer={isOwn ? outgoingViewer : null}
                incomingParticipantAuthor={incomingParticipantAuthor}
              />
            )
          })}
        </SupportChatThread>
      )}

      {canActAsAssignee ? (
        <SupportChatComposer>
          <div className="flex flex-row items-center gap-m3">
            <div className="min-w-0 flex-1">
              <Input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder={t('hackathons.support.mentor.reply_placeholder')}
                disabled={replyMutation.isPending}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void handleReply()
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="primary"
              text={t('hackathons.support.mentor.reply')}
              disabled={replyMutation.isPending || !draft.trim()}
              onClick={() => void handleReply()}
            />
          </div>
        </SupportChatComposer>
      ) : assignedToOther ? (
        <p className="typography-caption-sm-regular text-text-tertiary pt-m2">
          {t('hackathons.support.mentor.reply_hint_other_mentor')}
        </p>
      ) : showClaimHint ? (
        <p className="typography-caption-sm-regular text-text-tertiary pt-m2">
          {t('hackathons.support.mentor.reply_hint_claim')}
        </p>
      ) : null}
    </div>
  )
}
