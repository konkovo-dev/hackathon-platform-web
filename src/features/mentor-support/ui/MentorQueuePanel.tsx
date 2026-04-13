'use client'

import { Button, ListItem, Section } from '@/shared/ui'
import { formatRelativeTime } from '@/shared/lib/formatDate'
import { useI18n, useT } from '@/shared/i18n/useT'
import { useClaimSupportTicketMutation } from '../model/hooks'
import type { SupportTicket } from '../lib/supportUi'
import { sortTicketsByCreatedDesc } from '../lib/supportUi'

export interface MentorQueuePanelProps {
  hackathonId: string
  unassigned: SupportTicket[]
  mine: SupportTicket[]
  others: SupportTicket[]
  selectedTicketId: string | null
  currentUserId: string | undefined
  canClaimTickets: boolean
  onSelect: (ticket: SupportTicket) => void
}

export function MentorQueuePanel({
  hackathonId,
  unassigned,
  mine,
  others,
  selectedTicketId,
  currentUserId,
  canClaimTickets,
  onSelect,
}: MentorQueuePanelProps) {
  const t = useT()
  const { locale } = useI18n()
  const claimMutation = useClaimSupportTicketMutation(hackathonId)

  const renderTicket = (ticket: SupportTicket, showClaim: boolean) => {
    const id = ticket.ticketId
    if (!id) return null
    const created = ticket.createdAt
    const subtitle =
      created && !Number.isNaN(Date.parse(created))
        ? formatRelativeTime(created, locale)
        : undefined
    const kind =
      ticket.ownerKind === 'OWNER_KIND_TEAM'
        ? t('hackathons.support.mentor.owner_team')
        : t('hackathons.support.mentor.owner_user')

    return (
      <ListItem
        key={id}
        variant="bordered"
        active={selectedTicketId === id}
        onClick={() => onSelect(ticket)}
        text={kind}
        subtitle={subtitle}
        rightContent={
          showClaim ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              text={t('hackathons.support.mentor.claim')}
              disabled={claimMutation.isPending}
              onClick={e => {
                e.stopPropagation()
                void claimMutation
                  .mutateAsync(id)
                  .then(() => {
                    onSelect({
                      ...ticket,
                      assignedMentorUserId: currentUserId ?? ticket.assignedMentorUserId,
                    })
                  })
                  .catch(() => {})
              }}
            />
          ) : undefined
        }
      />
    )
  }

  const u = sortTicketsByCreatedDesc(unassigned)
  const m = sortTicketsByCreatedDesc(mine)
  const o = sortTicketsByCreatedDesc(others)

  return (
    <div className="flex flex-col gap-m8">
      {claimMutation.isError ? (
        <p className="typography-body-sm-regular text-state-error">
          {t('hackathons.support.error')}
        </p>
      ) : null}
      <Section variant="elevated" title={t('hackathons.support.mentor.queue_title')}>
        {u.length === 0 ? (
          <p className="typography-body-md text-text-tertiary">
            {t('hackathons.support.mentor.queue_empty')}
          </p>
        ) : (
          <div className="flex flex-col gap-m4">
            {u.map(ticket => renderTicket(ticket, canClaimTickets))}
          </div>
        )}
      </Section>

      <Section variant="elevated" title={t('hackathons.support.mentor.assigned_title')}>
        {m.length === 0 ? (
          <p className="typography-body-md text-text-tertiary">
            {t('hackathons.support.mentor.assigned_empty')}
          </p>
        ) : (
          <div className="flex flex-col gap-m4">{m.map(ticket => renderTicket(ticket, false))}</div>
        )}
      </Section>

      {o.length > 0 ? (
        <Section variant="elevated" title={t('hackathons.support.mentor.others_title')}>
          <div className="flex flex-col gap-m4">{o.map(ticket => renderTicket(ticket, false))}</div>
        </Section>
      ) : null}
    </div>
  )
}
