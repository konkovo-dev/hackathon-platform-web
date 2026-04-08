'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, Section } from '@/shared/ui'
import { cn } from '@/shared/lib/cn'
import { useT } from '@/shared/i18n/useT'
import { useSessionQuery } from '@/features/auth/model/hooks'
import { useSupportOpenTicketsQuery } from '../model/hooks'
import { partitionOpenTickets, type SupportTicket } from '../lib/supportUi'
import { MentorQueuePanel } from './MentorQueuePanel'
import { MentorTicketChat } from './MentorTicketChat'

export interface MentorDashboardProps {
  hackathonId: string
  canManage: boolean
}

export function MentorDashboard({ hackathonId, canManage }: MentorDashboardProps) {
  const t = useT()
  const { data: session } = useSessionQuery()
  const userId = session && session.active ? session.userId : undefined

  const ticketsQuery = useSupportOpenTicketsQuery(hackathonId, true)
  const [selected, setSelected] = useState<SupportTicket | null>(null)
  const [mobilePanel, setMobilePanel] = useState<'list' | 'chat'>('list')

  const hasChatOpen = Boolean(selected?.ticketId)

  const { unassigned, mine, others } = useMemo(
    () => partitionOpenTickets(ticketsQuery.data ?? [], userId, canManage),
    [ticketsQuery.data, userId, canManage]
  )

  useEffect(() => {
    if (!selected?.ticketId) return
    const list = ticketsQuery.data ?? []
    const fresh = list.find(x => x.ticketId === selected.ticketId)
    if (!fresh) {
      setSelected(null)
      return
    }
    if (
      fresh.status !== selected.status ||
      fresh.assignedMentorUserId !== selected.assignedMentorUserId
    ) {
      setSelected(fresh)
    }
  }, [ticketsQuery.data, selected])

  useEffect(() => {
    if (mobilePanel === 'chat' && !hasChatOpen) {
      setMobilePanel('list')
    }
  }, [mobilePanel, hasChatOpen])

  if (ticketsQuery.isLoading) {
    return (
      <p className="typography-body-md text-text-secondary">{t('hackathons.support.loading')}</p>
    )
  }

  if (ticketsQuery.isError) {
    return (
      <p className="typography-body-md text-state-error">{t('hackathons.support.error')}</p>
    )
  }

  const listSectionClass = hasChatOpen
    ? mobilePanel === 'chat'
      ? 'hidden md:flex md:flex-1 md:min-w-0 md:max-w-md'
      : 'flex-1 md:max-w-md md:min-w-0'
    : 'flex-1 w-full md:min-w-0'

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-m8">
      <div className="flex md:hidden gap-m4">
        <Button
          type="button"
          variant={mobilePanel === 'list' ? 'primary' : 'secondary'}
          size="sm"
          text={t('hackathons.support.mentor.mobile_list')}
          onClick={() => setMobilePanel('list')}
        />
        {hasChatOpen ? (
          <Button
            type="button"
            variant={mobilePanel === 'chat' ? 'primary' : 'secondary'}
            size="sm"
            text={t('hackathons.support.mentor.mobile_chat')}
            onClick={() => setMobilePanel('chat')}
          />
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-stretch gap-m8 md:flex-row md:items-stretch">
        <div className={cn('flex flex-col min-w-0', listSectionClass)}>
          <MentorQueuePanel
            hackathonId={hackathonId}
            unassigned={unassigned}
            mine={mine}
            others={others}
            selectedTicketId={selected?.ticketId ?? null}
            currentUserId={userId}
            canClaimTickets={!canManage}
            onSelect={ticket => {
              setSelected(ticket)
              setMobilePanel('chat')
            }}
          />
        </div>

        {hasChatOpen && selected ? (
          <Section
            variant="outlined"
            className={
              mobilePanel === 'list'
                ? 'hidden min-h-0 flex-1 flex-col md:flex md:flex-[2] md:min-w-0'
                : 'flex min-h-0 flex-1 flex-col md:flex-[2] md:min-w-0'
            }
          >
            <MentorTicketChat
              hackathonId={hackathonId}
              ticket={selected}
              canClaimTickets={!canManage}
            />
          </Section>
        ) : null}
      </div>
    </div>
  )
}
