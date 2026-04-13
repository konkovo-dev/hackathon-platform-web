'use client'

import { useMemo, useState } from 'react'
import { Button, Input } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useSessionQuery } from '@/features/auth/model/hooks'
import { useSupportViewerOutgoingMeta } from '../lib/useSupportViewerOutgoingMeta'
import {
  useMySupportMessagesQuery,
  useSendSupportMessageMutation,
  useSupportMessageAuthorsQuery,
} from '../model/hooks'
import {
  buildSupportChatTimeline,
  collectParticipantAuthorUserIds,
  sortMessagesByTime,
  supportParticipantAuthorUserId,
} from '../lib/supportUi'
import { SupportChatComposer, SupportChatThread } from './SupportChatShell'
import { SupportChatDaySeparator } from './SupportChatDaySeparator'
import { SupportMessageRow } from './SupportMessageRow'

export interface ParticipantChatPanelProps {
  hackathonId: string
}

const bubbleEnd = 'end' as const
const bubbleStart = 'start' as const

export function ParticipantChatPanel({ hackathonId }: ParticipantChatPanelProps) {
  const t = useT()
  const { data: session } = useSessionQuery()
  const userId = session && session.active ? session.userId : undefined

  const messagesQuery = useMySupportMessagesQuery(hackathonId)
  const sendMutation = useSendSupportMessageMutation(hackathonId)
  const outgoingViewer = useSupportViewerOutgoingMeta()
  const [draft, setDraft] = useState('')

  const sorted = useMemo(() => sortMessagesByTime(messagesQuery.data ?? []), [messagesQuery.data])

  const participantAuthorIds = useMemo(() => collectParticipantAuthorUserIds(sorted), [sorted])
  const authorsQuery = useSupportMessageAuthorsQuery(participantAuthorIds)

  const timeline = useMemo(() => buildSupportChatTimeline(sorted), [sorted])

  const handleSend = async () => {
    const text = draft.trim()
    if (!text || sendMutation.isPending) return
    setDraft('')
    try {
      await sendMutation.mutateAsync(text)
    } catch {
      setDraft(text)
    }
  }

  if (messagesQuery.isLoading) {
    return (
      <p className="typography-body-md text-text-secondary">{t('hackathons.support.loading')}</p>
    )
  }

  if (messagesQuery.isError) {
    return <p className="typography-body-md text-state-error">{t('hackathons.support.error')}</p>
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-m6">
      <SupportChatThread className="min-h-0 flex-1">
        {sorted.length === 0 ? (
          <p className="typography-body-md text-text-secondary">
            {t('hackathons.support.participant.empty')}
          </p>
        ) : (
          timeline.map((item, index) => {
            if (item.kind === 'daySeparator') {
              return (
                <SupportChatDaySeparator
                  key={`day-${item.anchorIso}-${index}`}
                  anchorIso={item.anchorIso}
                />
              )
            }
            const m = item.message
            const isMine = m.authorUserId != null && userId != null && m.authorUserId === userId
            const side = isMine ? bubbleEnd : bubbleStart
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
                outgoingViewer={isMine ? outgoingViewer : null}
                incomingParticipantAuthor={incomingParticipantAuthor}
              />
            )
          })
        )}
      </SupportChatThread>

      <SupportChatComposer>
        {sendMutation.isError ? (
          <p className="typography-body-sm-regular text-state-error">
            {t('hackathons.support.error')}
          </p>
        ) : null}
        <div className="flex flex-row items-center gap-m3">
          <div className="min-w-0 flex-1">
            <Input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={t('hackathons.support.participant.input_placeholder')}
              disabled={sendMutation.isPending}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void handleSend()
                }
              }}
            />
          </div>
          <Button
            type="button"
            variant="primary"
            text={t('hackathons.support.participant.send')}
            disabled={sendMutation.isPending || !draft.trim()}
            onClick={() => void handleSend()}
          />
        </div>
        <p className="typography-caption-sm-regular text-text-tertiary">
          {t('hackathons.support.participant.footer_hint')}
        </p>
      </SupportChatComposer>
    </div>
  )
}
