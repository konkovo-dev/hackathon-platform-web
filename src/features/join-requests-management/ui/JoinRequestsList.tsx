'use client'

import { useMemo } from 'react'
import { Section } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import {
  useJoinRequestsQuery,
  useAcceptJoinRequestMutation,
  useRejectJoinRequestMutation,
} from '@/entities/team/model/hooks'
import type { Vacancy } from '@/entities/team'
import { JoinRequestItem } from './JoinRequestItem'

export interface JoinRequestsListProps {
  hackathonId: string
  teamId: string
  vacancies: Vacancy[]
}

export function JoinRequestsList({ hackathonId, teamId, vacancies }: JoinRequestsListProps) {
  const t = useT()
  const { data, isLoading } = useJoinRequestsQuery(hackathonId, teamId)
  const acceptMutation = useAcceptJoinRequestMutation(hackathonId, teamId)
  const rejectMutation = useRejectJoinRequestMutation(hackathonId, teamId)

  const pending = useMemo(() => {
    const list = data?.requests ?? []
    return list.filter(r => r.status === 'TEAM_INBOX_PENDING')
  }, [data?.requests])

  const count = pending.length

  if (isLoading) {
    return (
      <p className="typography-body-sm text-text-secondary">{t('teams.list.loading')}</p>
    )
  }

  return (
    <Section
      title={
        count > 0
          ? `${t('teams.joinRequests.title')} (${count})`
          : t('teams.joinRequests.title')
      }
      variant="elevated"
    >
      {pending.length === 0 ? (
        <p className="typography-body-sm text-text-secondary">{t('teams.joinRequests.empty')}</p>
      ) : (
        <div className="flex flex-col gap-m4">
          {pending.map(req => (
            <JoinRequestItem
              key={req.requestId ?? ''}
              request={req}
              vacancies={vacancies}
              onAccept={() => {
                if (req.requestId) acceptMutation.mutate(req.requestId)
              }}
              onReject={() => {
                if (req.requestId) rejectMutation.mutate(req.requestId)
              }}
              isAccepting={acceptMutation.isPending}
              isRejecting={rejectMutation.isPending}
            />
          ))}
        </div>
      )}
    </Section>
  )
}
