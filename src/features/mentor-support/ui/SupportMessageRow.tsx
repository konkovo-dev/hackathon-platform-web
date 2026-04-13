'use client'

import { Avatar, AVATAR_PLACEHOLDER_ELEVATED } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'
import { formatTimeShort } from '@/shared/lib/formatDate'
import { useI18n } from '@/shared/i18n/useT'
import type { components } from '@/shared/api/platform.schema'
import type { SupportMessageAuthorProfile } from '../lib/supportMessageAuthorProfile'
import type { SupportViewerOutgoingMeta } from '../lib/useSupportViewerOutgoingMeta'
import type { SupportTranslate } from '../lib/localizeSupportSystemMessage'
import { localizeSupportSystemMessage } from '../lib/localizeSupportSystemMessage'

type AuthorRole = components['schemas']['v1AuthorRole']

export interface SupportMessageRowProps {
  text: string
  createdAt?: string
  authorRole?: AuthorRole
  bubbleSide: 'start' | 'end'
  outgoingViewer?: SupportViewerOutgoingMeta | null
  /** Имя/аватар другого участника (API сообщения не отдаёт ФИО — подгружаем по authorUserId). */
  incomingParticipantAuthor?: SupportMessageAuthorProfile | null
}

function firstGlyphUpper(text: string, locale: string): string {
  const s = text.trim()
  if (!s) return '?'
  return s[0]!.toLocaleUpperCase(locale)
}

function incomingSenderMeta(
  authorRole: AuthorRole | undefined,
  t: SupportTranslate,
  locale: string
): { label: string; avatarName: string } {
  switch (authorRole) {
    case 'AUTHOR_ROLE_MENTOR':
      return {
        label: t('hackathons.support.message_from.mentor'),
        avatarName: locale.toLowerCase().startsWith('ru') ? 'М' : 'M',
      }
    case 'AUTHOR_ROLE_ORGANIZER': {
      const label = t('hackathons.support.message_from.organizer')
      return { label, avatarName: firstGlyphUpper(label, locale) }
    }
    default: {
      const label = t('hackathons.support.message_from.participant')
      return { label, avatarName: firstGlyphUpper(label, locale) }
    }
  }
}

export function SupportMessageRow({
  text,
  createdAt,
  authorRole,
  bubbleSide,
  outgoingViewer,
  incomingParticipantAuthor,
}: SupportMessageRowProps) {
  const { locale, t } = useI18n()

  const hasValidTime = Boolean(createdAt && !Number.isNaN(Date.parse(createdAt)))
  const timeLabel = hasValidTime ? formatTimeShort(createdAt, locale) : ''

  if (authorRole === 'AUTHOR_ROLE_SYSTEM') {
    const label = localizeSupportSystemMessage(text, t)
    return (
      <div className="flex w-full shrink-0 justify-center px-m2 py-m2">
        <p className="max-w-[min(100%,22rem)] text-center typography-caption-sm-regular text-text-tertiary">
          {label}
        </p>
      </div>
    )
  }

  const bubbleInner = (
    <>
      <p className="typography-body-md-regular whitespace-pre-wrap break-words">{text}</p>
      {timeLabel ? (
        <span className="self-end typography-caption-sm-regular text-text-tertiary tabular-nums">
          {timeLabel}
        </span>
      ) : null}
    </>
  )

  const bubbleEnd = (
    <div
      className={cn(
        'relative flex w-full min-w-0 flex-col gap-m2 rounded-[1.125rem] rounded-br-md px-m6 py-m3',
        'border border-brand-primary/35 bg-brand-primary/28 text-text-primary'
      )}
    >
      {bubbleInner}
    </div>
  )

  if (bubbleSide === 'end' && outgoingViewer) {
    return (
      <div className="flex max-w-[min(92%,32rem)] shrink-0 flex-row items-end gap-m4 self-end">
        <div className="flex min-w-0 flex-1 flex-col items-end">{bubbleEnd}</div>
        <Avatar
          src={outgoingViewer.avatarSrc}
          name={outgoingViewer.displayName || undefined}
          size="md"
          className="shrink-0"
          placeholderTone={AVATAR_PLACEHOLDER_ELEVATED}
        />
      </div>
    )
  }

  if (bubbleSide === 'start') {
    const isStaff = authorRole === 'AUTHOR_ROLE_MENTOR' || authorRole === 'AUTHOR_ROLE_ORGANIZER'
    const isMentorReply = authorRole === 'AUTHOR_ROLE_MENTOR'

    let senderLabel: string
    let avatarName: string
    let avatarSrc: string | undefined

    if (isStaff) {
      const meta = incomingSenderMeta(authorRole, t, locale)
      senderLabel = meta.label
      avatarName = meta.avatarName
      avatarSrc = undefined
    } else {
      const fallback = incomingSenderMeta(authorRole, t, locale)
      const resolvedName = incomingParticipantAuthor?.displayName?.trim()
      senderLabel = resolvedName || fallback.label
      avatarName = resolvedName || fallback.avatarName
      avatarSrc = incomingParticipantAuthor?.avatarSrc ?? undefined
    }

    const bubbleStart = (
      <div
        className={cn(
          'relative flex w-full min-w-0 flex-col gap-m2 rounded-[1.125rem] rounded-bl-md px-m6 py-m4',
          isMentorReply
            ? 'border border-brand-primary/40 bg-brand-primary/14 text-text-primary'
            : 'border border-border-default/70 bg-bg-elevated text-text-primary'
        )}
      >
        <span
          className={cn(
            'typography-caption-sm-regular text-text-secondary',
            isMentorReply && 'typography-caption-sm-medium text-brand-primary'
          )}
        >
          {senderLabel}
        </span>
        {bubbleInner}
      </div>
    )

    return (
      <div className="flex max-w-[min(92%,32rem)] shrink-0 flex-row items-end gap-m4 self-start">
        <Avatar
          src={avatarSrc}
          name={avatarName}
          size="md"
          className="shrink-0"
          placeholderTone={AVATAR_PLACEHOLDER_ELEVATED}
        />
        <div className="flex min-w-0 flex-1">{bubbleStart}</div>
      </div>
    )
  }

  return <div className="max-w-[min(88%,30rem)] shrink-0 self-end">{bubbleEnd}</div>
}
